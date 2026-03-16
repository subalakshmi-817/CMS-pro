const https = require('https');
const url = 'https://imwnycwiuwwbimunmvtu.supabase.co/rest/v1/';

const agent = new https.Agent({
  rejectUnauthorized: false
});

const req = https.request(url, {
  method: 'GET',
  agent: agent,
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltd255Y3dpdXd3YmltdW5tdnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzQzNzYsImV4cCI6MjA4NzE1MDM3Nn0.k0hDpHpwPFH_jkXjMSY-HWBo-mOybAnJOJ1ogLPzmf4'
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Response:', data));
});

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.end();
