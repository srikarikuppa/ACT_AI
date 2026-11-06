import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import https from 'https';
import { exec } from 'child_process';
import { GoogleGenAI, Type } from '@google/genai';
import mongoose from 'mongoose';
import { initFirebaseAdmin, optionalAuth, getAdminFirestore } from './src/backend/middleware/auth.ts';
import { Report } from './src/backend/models/Report.ts';
import { User } from './src/backend/models/User.ts';

dotenv.config();

initFirebaseAdmin();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/act_ai';
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('[ACT.ai] Connected to MongoDB'))
  .catch(err => console.warn('[ACT.ai] MongoDB connection warning (reports will be cached in-memory):', err.message || err));

// In-memory fallback cache so the app functions even if MongoDB is temporarily unreachable or blocked
const inMemoryReports = new Map<string, any>();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// AI Analysis Endpoint for ACT.ai
app.post('/api/analyze-report', optionalAuth, async (req, res) => {
  try {
    const { transcript, category, location, language, hasPhoto, hasVideo, hasVoiceNote } = req.body;

    const userLang = language || 'en';
    const langNames: Record<string, string> = {
      hi: 'Hindi',
      te: 'Telugu',
      ta: 'Tamil',
      mr: 'Marathi',
      bn: 'Bengali',
      en: 'English',
    };
    const targetLangName = langNames[userLang] || 'English';

    const ai = getGeminiClient();

    let userAudioResponseText = '';
    let urgencyScore = 5;

    // Create intelligent defaults based on the category
    if (category === 'violence' || category === 'women_safety') {
      urgencyScore = 9;
    } else if (category === 'theft') {
      urgencyScore = 6;
    } else if (category === 'land_crop' || category === 'other') {
      urgencyScore = 3;
    }

    let urgencyBadge = urgencyScore >= 8 ? 'Red - High' : urgencyScore >= 5 ? 'Yellow - Medium' : 'Green - Low';
    let detectedIssue = category || 'Unspecified Incident';
    let targetHelpline = category === 'women_safety' ? '1091 Women Helpline' : '112 National Emergency Helpline';
    let recommendedRouting = 'Local Police Control Room & Gram Panchayat Desk';
    let summaryEnglish = 'Citizen reported an incident requiring local review.';
    let keyEntities = {
      locations: [location?.village || location?.district || 'Unknown Location'],
      parties: ['Anonymous Citizen'],
      items: [],
    };

    if (ai) {
      try {
        const prompt = `
You are ACT.ai, an AI assistant for anonymous rural crime reporting in India.
Analyze the following crime report provided by a citizen.

Citizen Language: ${targetLangName} (${userLang})
Category Selected: ${category || 'None selected'}
Report Details / Transcript: "${transcript || 'No verbal details provided. Visual or location report.'}"
Location Context: State: ${location?.state || 'Unknown'}, District: ${location?.district || 'Unknown'}, Village/Panchayat: ${location?.village || 'Unknown'}
Evidence attached: Photo: ${hasPhoto ? 'Yes' : 'No'}, Video: ${hasVideo ? 'Yes' : 'No'}, Voice Note: ${hasVoiceNote ? 'Yes' : 'No'}

Your goal is to generate two parts:
1. USER AUDIO RESPONSE: Exactly 2 warm, compassionate, simple sentences in ${targetLangName} language re-assuring the rural citizen that their report was recorded anonymously and action will be taken safely. Keep words simple, encouraging, and clear for text-to-speech.
2. AUTHORITY DATA: Structured json details for law enforcement and local panchayat.

Return JSON in this schema:
{
  "user_audio_response": "2 warm reassurance sentences in ${targetLangName}",
  "detected_language": "${targetLangName}",
  "incident_type": "Specific short category e.g. Theft, Crop Dispute, Assault, Women Harassment, Extortion",
  "urgency_score": integer between 1 and 10,
  "urgency_badge": "Green - Low" OR "Yellow - Medium" OR "Red - High",
  "summary_english": "Clear 2-3 sentence summary in simple English for police officers",
  "recommended_routing": "Specific local authority e.g. Local Mahila Police Station / Gram Panchayat Sarpanch Desk / District Revenue Officer / 112 Control Room",
  "target_helpline": "e.g. 112 Emergency SOS or 1091 Women Helpline or 1800 Panchayat Desk",
  "key_entities": {
    "locations": ["location names"],
    "parties": ["parties or suspects if mentioned"],
    "items": ["stolen or disputed items if mentioned"]
  }
}
        `;

        const response = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        if (response.text) {
          let cleanText = response.text.trim();
          if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
          }
          const parsed = JSON.parse(cleanText);
          userAudioResponseText = parsed.user_audio_response || '';
          urgencyScore = parsed.urgency_score || 5;
          urgencyBadge = urgencyScore >= 8 ? 'Red - High' : urgencyScore >= 5 ? 'Yellow - Medium' : 'Green - Low';
          detectedIssue = parsed.incident_type || category || 'Reported Incident';
          targetHelpline = parsed.target_helpline || '112 National Emergency';
          recommendedRouting = parsed.recommended_routing || 'Local Police Station & Panchayat';
          summaryEnglish = parsed.summary_english || 'Anonymous report registered.';
          if (parsed.key_entities) {
            keyEntities = parsed.key_entities;
          }
        }
      } catch (geminiError) {
        console.warn('Gemini AI API processing fallback:', geminiError);
      }
    }

    // Fallback reassurance generators if AI text was empty
    if (!userAudioResponseText) {
      const fallbackReassurances: Record<string, string> = {
        hi: 'आपकी रिपोर्ट सुरक्षित और पूरी तरह गुप्त दर्ज कर ली गई है। चिंता न करें, हमारी टीम आपकी मदद के लिए काम कर रही है।',
        te: 'మీ ఫిర్యాదు పూర్తి రహస్యంగా నమోదు చేయబడింది. ఆందోళన చెందకండి, అధికారులు తగిన చర్యలు తీసుకుంటారు.',
        ta: 'உங்கள் புகார் முற்றிலும் ரகசியமாகப் பதிவு செய்யப்பட்டுள்ளது. கவலைப்பட வேண்டாம், உரிய நடவடிக்கை எடுக்கப்படும்.',
        mr: 'तुमची तक्रार पूर्णपणे गुप्त आणि सुरक्षित नोंदवली गेली आहे. काळजी करू नका, योग्य ती कारवाई केली जाईल.',
        bn: 'আপনার অভিযোগ সম্পূর্ণ গোপনে নথিভুক্ত করা হয়েছে। দুশ্চিন্তা করবেন না, সঠিক ব্যবস্থা নেওয়া হচ্ছে।',
        en: 'Your report has been securely registered in complete confidence. Rest assured, your identity is safe and action is being taken.',
      };
      userAudioResponseText = fallbackReassurances[userLang] || fallbackReassurances.en;
    }

    const authorityDataJson = {
      timestamp: new Date().toISOString(),
      detected_language: targetLangName,
      incident_type: detectedIssue,
      urgency_score: urgencyScore,
      urgency_badge: urgencyBadge,
      summary_english: summaryEnglish,
      recommended_routing: recommendedRouting,
      target_helpline: targetHelpline,
      key_entities: keyEntities,
      location_details: location,
      proof_attached: {
        photo: Boolean(hasPhoto),
        video: Boolean(hasVideo),
        voice_note: Boolean(hasVoiceNote),
      },
      anonymity_verified: true,
    };

    const caseCode = `ACT-${Math.floor(1000 + Math.random() * 9000)}`;

    const reportData = {
      caseCode,
      firebaseUid: req.user?.uid,
      incidentCategory: category || 'other',
      transcript,
      language: userLang,
      location,
      media: {
        photoUrl: hasPhoto ? 'yes' : '',
        videoUrl: hasVideo ? 'yes' : '',
        voiceNoteUrl: hasVoiceNote ? 'yes' : '',
      },
      analysis: {
        urgencyScore,
        urgencyBadge,
        detectedIssue,
        targetHelpline,
        recommendedRouting,
        summaryEnglish,
        keyEntities,
      },
      createdAt: new Date().toISOString(),
    };

    inMemoryReports.set(caseCode, reportData);

    // 1. Store in Firebase Firestore (Admin SDK)
    const adminDb = getAdminFirestore();
    if (adminDb) {
      try {
        await adminDb.collection('reports').doc(caseCode).set({
          ...reportData,
          status: 'Submitted',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log(`[ACT.ai] Report ${caseCode} stored in Firebase Firestore!`);
      } catch (fbErr: any) {
        console.warn(`[ACT.ai] Firebase Firestore save warning for ${caseCode}:`, fbErr.message || fbErr);
      }
    }

    // 2. Store in MongoDB
    try {
      if (mongoose.connection.readyState === 1) {
        await Report.create(reportData);
      } else {
        console.warn(`[ACT.ai] MongoDB not connected (readyState: ${mongoose.connection.readyState}). Report ${caseCode} saved in-memory and Firebase.`);
      }
    } catch (dbErr: any) {
      console.warn(`[ACT.ai] MongoDB save warning for ${caseCode} (retained in-memory and Firebase):`, dbErr.message || dbErr);
    }

    return res.json({
      success: true,
      analysis: {
        caseCode,
        userAudioResponseText,
        urgencyScore,
        urgencyBadge,
        detectedIssue,
        targetHelpline,
        recommendedRouting,
        summaryEnglish,
        keyEntities,
        rawAuthorityJson: authorityDataJson,
      },
    });
  } catch (error: any) {
    console.error('Server error analyzing report:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process report',
    });
  }
});

// Get Report by Case Code
app.get('/api/reports/:caseCode', optionalAuth, async (req, res) => {
  try {
    const cleanCode = (req.params.caseCode || '').replace('#', '').trim().toUpperCase();
    let report: any = null;
    if (mongoose.connection.readyState === 1) {
      report = await Report.findOne({ caseCode: cleanCode });
    }
    if (!report) {
      report = inMemoryReports.get(cleanCode);
    }
    if (!report) {
      const adminDb = getAdminFirestore();
      if (adminDb) {
        try {
          const docSnap = await adminDb.collection('reports').doc(cleanCode).get();
          if (docSnap.exists) {
            report = docSnap.data();
          }
        } catch (e) {}
      }
    }
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ success: true, report });
  } catch (error) {
    const cleanCode = (req.params.caseCode || '').replace('#', '').trim().toUpperCase();
    const cached = inMemoryReports.get(cleanCode);
    if (cached) {
      return res.json({ success: true, report: cached });
    }
    res.status(500).json({ error: 'Server error fetching report' });
  }
});

// Update Report Status (from Police Dashboard)
app.patch('/api/reports/:caseCode/status', optionalAuth, async (req, res) => {
  try {
    const cleanCode = (req.params.caseCode || '').replace('#', '').trim().toUpperCase();
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    let mem = inMemoryReports.get(cleanCode);
    if (mem) {
      mem.status = status;
      mem.updatedAt = new Date().toISOString();
    }

    // 1. Update in Firebase Firestore
    const adminDb = getAdminFirestore();
    if (adminDb) {
      try {
        await adminDb.collection('reports').doc(cleanCode).set({
          status,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log(`[ACT.ai] Status updated in Firebase Firestore for ${cleanCode}`);
      } catch (fbErr: any) {
        console.warn(`[ACT.ai] Firebase status update warning:`, fbErr.message || fbErr);
      }
    }

    // 2. Update in MongoDB
    if (mongoose.connection.readyState === 1) {
      await Report.findOneAndUpdate(
        { caseCode: cleanCode },
        { $set: { status, updatedAt: new Date() } }
      );
    }

    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    let reports: any[] = [];
    if (mongoose.connection.readyState === 1) {
      reports = await Report.find({});
    }
    if (reports.length === 0 && inMemoryReports.size > 0) {
      reports = Array.from(inMemoryReports.values());
    }

    const analyticsMap = new Map();

    // Add default month if empty
    if (reports.length === 0) {
      const curMonth = new Date().toLocaleString('default', { month: 'short' });
      analyticsMap.set(curMonth, { month: curMonth, theft: 0, harassment: 0, disputes: 0, emergencies: 0 });
    }

    reports.forEach(r => {
      const month = new Date(r.createdAt).toLocaleString('default', { month: 'short' });
      if (!analyticsMap.has(month)) {
        analyticsMap.set(month, { month, theft: 0, harassment: 0, disputes: 0, emergencies: 0 });
      }

      const stats = analyticsMap.get(month);
      const cat = (r.incidentCategory || '').toLowerCase();
      if (cat.includes('theft')) stats.theft++;
      else if (cat.includes('women') || cat.includes('harass')) stats.harassment++;
      else if (cat.includes('land') || cat.includes('crop') || cat.includes('dispute')) stats.disputes++;
      else stats.emergencies++;
    });

    const data = Array.from(analyticsMap.values());
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating analytics' });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ACT.ai Rural Safety Backend' });
});

// Get all reports (for Police Dashboard)
app.get('/api/reports', optionalAuth, async (req, res) => {
  try {
    let reports: any[] = [];
    if (mongoose.connection.readyState === 1) {
      reports = await Report.find({}).sort({ createdAt: -1 });
    }
    const inMemList = Array.from(inMemoryReports.values());
    const existingCodes = new Set(reports.map(r => r.caseCode));
    for (const mem of inMemList) {
      if (!existingCodes.has(mem.caseCode)) {
        reports.push(mem);
        existingCodes.add(mem.caseCode);
      }
    }

    // Also merge from Firebase Firestore
    const adminDb = getAdminFirestore();
    if (adminDb) {
      try {
        const snap = await adminDb.collection('reports').get();
        snap.docs.forEach(d => {
          const r = d.data();
          if (r.caseCode && !existingCodes.has(r.caseCode)) {
            reports.push(r);
            existingCodes.add(r.caseCode);
          }
        });
      } catch (e) {}
    }

    res.json({ success: true, reports });
  } catch (error) {
    res.json({ success: true, reports: Array.from(inMemoryReports.values()) });
  }
});

// Get Messages for a Case
app.get('/api/reports/:caseCode/messages', optionalAuth, async (req, res) => {
  try {
    const cleanCode = (req.params.caseCode || '').replace('#', '').trim().toUpperCase();
    let report: any = null;
    if (mongoose.connection.readyState === 1) {
      report = await Report.findOne({ caseCode: cleanCode });
    }
    if (!report) {
      report = inMemoryReports.get(cleanCode);
    }
    let messages = report?.messages || [];

    // If no messages in local/mongo, check Firebase Firestore
    if (messages.length === 0) {
      const adminDb = getAdminFirestore();
      if (adminDb) {
        try {
          const snap = await adminDb.collection('chats').doc(cleanCode).collection('messages').orderBy('timestamp', 'asc').get();
          if (!snap.empty) {
            messages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        } catch (e) {}
      }
    }

    res.json({ success: true, messages });
  } catch (error) {
    const cleanCode = (req.params.caseCode || '').replace('#', '').trim().toUpperCase();
    const mem = inMemoryReports.get(cleanCode);
    res.json({ success: true, messages: mem?.messages || [] });
  }
});

// Post a Message to a Case
app.post('/api/reports/:caseCode/messages', optionalAuth, async (req, res) => {
  try {
    const cleanCode = (req.params.caseCode || '').replace('#', '').trim().toUpperCase();
    const { sender, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const newMessage = {
      sender: sender || 'citizen',
      text: text.trim(),
      timestamp: new Date(),
    };

    // 1. Update in-memory report
    let mem = inMemoryReports.get(cleanCode);
    if (mem) {
      if (!mem.messages) mem.messages = [];
      mem.messages.push(newMessage);
    } else {
      inMemoryReports.set(cleanCode, { caseCode: cleanCode, messages: [newMessage] });
    }

    // 2. Save directly to Firebase Firestore (Admin SDK)
    const adminDb = getAdminFirestore();
    if (adminDb) {
      try {
        await adminDb.collection('chats').doc(cleanCode).collection('messages').add({
          sender: sender || 'citizen',
          text: text.trim(),
          timestamp: new Date(),
        });
        console.log(`[ACT.ai] Message stored in Firebase Firestore for ${cleanCode}`);
      } catch (fbErr: any) {
        console.warn('[ACT.ai] Firebase Firestore message save warning:', fbErr.message || fbErr);
      }
    }

    // 3. Update MongoDB report if connected
    if (mongoose.connection.readyState === 1) {
      await Report.findOneAndUpdate(
        { caseCode: cleanCode },
        { $push: { messages: newMessage } }
      );
    }

    res.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: 'Server error saving message' });
  }
});

// Proxy for TTS to avoid browser CORS/blocking issues
app.get('/api/tts', (req, res) => {
  const text = (req.query.text as string) || '';
  const lang = (req.query.lang as string) || 'en';
  if (!text) return res.status(400).send('No text');

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

  const request = https.get(
    url,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    },
    (response) => {
      if (response.statusCode !== 200) {
        return res.status(response.statusCode || 500).send('TTS upstream error');
      }
      res.setHeader('Content-Type', 'audio/mpeg');
      response.pipe(res);
    }
  );

  request.on('error', (err) => {
    console.warn('TTS Proxy Error (will use browser fallback):', err.message || err);
    if (!res.headersSent) {
      res.status(500).send('Error generating TTS');
    }
  });
});

// Setup Vite development middleware or static production serving
async function setupApp() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[ACT.ai] ❌ Port ${PORT} is already in use by another running process.`);
      console.error(`Please close the other process or run: taskkill /f /im node.exe\n`);
    } else {
      console.error('[ACT.ai] Server error:', err);
    }
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`[ACT.ai] Server running on ${url}`);

    // Automatically open the browser
    const startCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${startCmd} ${url}`);
  });
}

setupApp();
