const https = require('https');

const options = {
  hostname: 'imwnycwiuwwbimunmvtu.supabase.co',
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  rejectUnauthorized: false // This ignores the 2026/2025 date issue
};

console.log('Testing connection to Supabase (ignoring SSL)...');

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error('Connection failed:');
  console.error('Error Name:', e.name);
  console.error('Error Code:', e.code);
  console.error('Error Message:', e.message);
});

req.end();
