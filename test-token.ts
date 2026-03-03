import https from 'https';

async function testToken() {
  const clientId = 'e4f27a05-1452-4122-8744-99cb70a752cf';
  const clientSecret = '8cb6a372-6b5a-47dc-a8cd-378176c53786';

  const endpoints = [
    '/api/oauth/token',
    '/oauth2/token',
    '/api/partner/oauth2/token',
    '/api/partner/v1/token',
    '/api/auth/token',
    '/api/partner/auth/token'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`https://api.syncpayments.com.br${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials'
        })
      });
      console.log(endpoint, res.status, await res.text().then(t => t.substring(0, 100)));
    } catch (e) {
      console.log(endpoint, 'error');
    }
  }
}

testToken();
