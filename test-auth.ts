async function testAuth() {
  const clientId = "89210cff-1a37-4cd0-825d-45fecd8e77bb";
  const clientSecret = "dadc1b2c-86ee-4256-845a-d1511de315bb";
  
  try {
    const res = await fetch(`https://api.syncpayments.com.br/api/partner/v1/auth-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret
      })
    });
    console.log(res.status, await res.text().then(t => t.substring(0, 500)));
  } catch (e) {
    console.log('error');
  }
}
testAuth();
