const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- [ACT.ai API Test Suite] ---');

  // 1. Health check
  try {
    const health = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
    console.log('✅ 1. Health check:', health.status, health.data || health.raw);
  } catch (err) {
    console.error('❌ Server is not running on http://localhost:3000:', err.message);
    process.exit(1);
  }

  // 2. Analyze report
  let caseCode = '';
  try {
    const reportPayload = {
      transcript: 'mera phone chori ho gaya market me',
      category: 'theft',
      location: { state: 'Uttar Pradesh', district: 'Varanasi', village: 'Shivpur Gram Panchayat' },
      language: 'hi',
      hasPhoto: false,
      hasVideo: false,
      hasVoiceNote: false
    };

    const res = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/analyze-report',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      reportPayload
    );

    console.log('✅ 2. Analyze report:', res.status, res.data?.success ? 'SUCCESS' : 'FAILED');
    if (res.data?.analysis) {
      caseCode = res.data.analysis.caseCode;
      console.log('   Generated Case Code:', caseCode);
      console.log('   Urgency Badge:', res.data.analysis.urgencyBadge);
      console.log('   Spoken Audio Reassurance:', res.data.analysis.userAudioResponseText);
    }
  } catch (err) {
    console.error('❌ Analyze report failed:', err.message);
  }

  if (caseCode) {
    // 3. Get report by case code
    try {
      const cleanCode = caseCode.replace('#', '');
      const getRes = await request({ hostname: 'localhost', port: 3000, path: `/api/reports/${cleanCode}`, method: 'GET' });
      console.log('✅ 3. Fetch report by code:', getRes.status, getRes.data?.success ? 'FOUND' : 'NOT FOUND');
    } catch (err) {
      console.error('❌ Fetch report failed:', err.message);
    }

    // 4. Send chat message
    try {
      const cleanCode = caseCode.replace('#', '');
      const msgRes = await request(
        {
          hostname: 'localhost',
          port: 3000,
          path: `/api/reports/${cleanCode}/messages`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        { sender: 'citizen', text: 'Hello officer, any updates on my report?' }
      );
      console.log('✅ 4. Send message:', msgRes.status, msgRes.data?.success ? 'SENT' : 'FAILED');
    } catch (err) {
      console.error('❌ Send message failed:', err.message);
    }

    // 5. Fetch messages
    try {
      const cleanCode = caseCode.replace('#', '');
      const fetchMsgs = await request({ hostname: 'localhost', port: 3000, path: `/api/reports/${cleanCode}/messages`, method: 'GET' });
      console.log('✅ 5. Fetch messages:', fetchMsgs.status, `(${fetchMsgs.data?.messages?.length || 0} messages found)`);
    } catch (err) {
      console.error('❌ Fetch messages failed:', err.message);
    }

    // 6. Update status
    try {
      const cleanCode = caseCode.replace('#', '');
      const patchRes = await request(
        {
          hostname: 'localhost',
          port: 3000,
          path: `/api/reports/${cleanCode}/status`,
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        },
        { status: 'Action Taken' }
      );
      console.log('✅ 6. Update status to Action Taken:', patchRes.status, patchRes.data?.success ? 'UPDATED' : 'FAILED');
    } catch (err) {
      console.error('❌ Update status failed:', err.message);
    }
  }

  // 7. List all reports for authority dashboard
  try {
    const allReports = await request({ hostname: 'localhost', port: 3000, path: '/api/reports', method: 'GET' });
    console.log('✅ 7. Fetch all reports (Police Dashboard):', allReports.status, `(${allReports.data?.reports?.length || 0} reports total)`);
  } catch (err) {
    console.error('❌ Fetch all reports failed:', err.message);
  }

  console.log('--- [Test Suite Complete] ---');
}

runTests();
