const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Cloudflare Tunnel...');

// On Windows, npx must be called as npx.cmd
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const cloudflared = spawn(command, ['-y', 'cloudflared', 'tunnel', '--url', 'http://127.0.0.1:3000', '--protocol', 'http2'], { shell: true });

const appJsPath = path.join(__dirname, 'mobile', 'App.js');

cloudflared.stderr.on('data', (data) => {
  const output = data.toString();
  // Print tunnel logs to terminal
  process.stdout.write(output);
  
  // Look for the trycloudflare.com URL in the logs
  const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match) {
    const tunnelUrl = match[0];
    console.log(`\n\n======================================================`);
    console.log(`✅ New Tunnel URL Detected: ${tunnelUrl}`);
    
    try {
      // Read and update App.js automatically
      let appJsContent = fs.readFileSync(appJsPath, 'utf8');
      
      // Replace the APP_URL line
      const updatedContent = appJsContent.replace(
        /const APP_URL = 'https:\/\/[^']+';/, 
        `const APP_URL = '${tunnelUrl}';`
      );
      
      if (appJsContent !== updatedContent) {
        fs.writeFileSync(appJsPath, updatedContent);
        console.log(`✅ Successfully updated mobile/App.js!`);
        console.log(`📱 Press 'Shift + R' in your Expo terminal to reload the app.`);
      } else {
        console.log(`⚠️ App.js already has this URL.`);
      }
    } catch (err) {
      console.error(`❌ Failed to update App.js:`, err.message);
    }
    console.log(`======================================================\n\n`);
  }
});

cloudflared.on('close', (code) => {
  console.log(`Tunnel process exited with code ${code}`);
});
