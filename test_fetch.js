const fetch = require('node-fetch');

async function testSupabase() {
    const url = 'https://imwnycwiuwwbimunmvtu.supabase.co/rest/v1/';
    console.log('Testing connection to:', url);
    try {
        const response = await fetch(url);
        console.log('Status:', response.status);
        console.log('OK:', response.ok);
        const text = await response.text();
        console.log('Response:', text);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testSupabase();
