const http = require('http');

const data = JSON.stringify({
  transcript: "mera phone chori ho gaya",
  category: "",
  location: { state: "Delhi", district: "New Delhi", village: "Connaught Place" },
  language: "hi",
  hasPhoto: false,
  hasVideo: false,
  hasVoiceNote: false
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/analyze-report',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', (e) => console.error('Error:', e));
req.write(data);
req.end();
