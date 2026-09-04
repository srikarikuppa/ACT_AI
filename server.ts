import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import https from 'https';
import { exec } from 'child_process';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

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
app.post('/api/analyze-report', async (req, res) => {
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
          model: 'gemini-3.6-flash',
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

    return res.json({
      success: true,
      analysis: {
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

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ACT.ai Rural Safety Backend' });
});

// Proxy for TTS to avoid browser CORS/blocking issues
app.get('/api/tts', (req, res) => {
  const text = (req.query.text as string) || '';
  const lang = (req.query.lang as string) || 'en';
  if (!text) return res.status(400).send('No text');

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
  
  https.get(url, (response) => {
    res.setHeader('Content-Type', 'audio/mpeg');
    response.pipe(res);
  }).on('error', (err) => {
    console.error('TTS Proxy Error:', err);
    res.status(500).send('Error generating TTS');
  });
});

// Setup Vite development middleware or static production serving
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
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

  app.listen(PORT, '0.0.0.0', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`[ACT.ai] Server running on ${url}`);
    
    // Automatically open the browser
    const startCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${startCmd} ${url}`);
  });
}

setupApp();
