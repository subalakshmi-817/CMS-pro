const fetch = require('node-fetch');

const url = 'https://imwnycwiuwwbimunmvtu.supabase.co/auth/v1/signup';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltd255Y3dpdXd3YmltdW5tdnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzQzNzYsImV4cCI6MjA4NzE1MDM3Nn0.k0hDpHpwPFH_jkXjMSY-HWBo-mOybAnJOJ1ogLPzmf4';

async function testFetch() {
  console.log('Testing fetch to:', url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test' + Math.random() + '@example.com',
        password: 'password123'
      })
    });
    
    const status = response.status;
    const text = await response.text();
    console.log('Status:', status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Fetch Error:', error.message);
    if (error.code) console.error('Error Code:', error.code);
  }
}

testFetch();
