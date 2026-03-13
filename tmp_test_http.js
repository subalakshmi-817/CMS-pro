
const http = require('http');

http.get('http://imwnycwiuwwbimunmvtu.supabase.co', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error('Error:', e.message);
});