import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, name, cpf, email, phone } = JSON.parse(event.body || '{}');

    // Usando o Client Secret como Token (ou o token gerado no painel)
    const token = '8cb6a372-6b5a-47dc-a8cd-378176c53786';

    const response = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Number(amount),
        description: "Doação SOS Minas Gerais",
        webhook_url: "https://seusite.com/webhook", // Opcional
        client: {
          name: name || "Doador",
          cpf: cpf ? cpf.replace(/\D/g, '') : "00000000000",
          email: email || "doador@email.com",
          phone: phone ? phone.replace(/\D/g, '') : "00000000000"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro SyncPay:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Erro ao gerar PIX na SyncPay', details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro interno:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno do servidor' })
    };
  }
};
