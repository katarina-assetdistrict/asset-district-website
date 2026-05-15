export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, groupId } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYWEzMmM3MDI1NDlhMGNkZjE3M2E2MjkyMWExOGJmZWNjYzFmMjIyMDU3N2MyM2NjNWYyYmUzMDU2ODFiYmMyOGI4MjU1MGY4ZDIzMmRiYjMiLCJpYXQiOjE3Nzg4NTAxODEuNTA2OTI2LCJuYmYiOjE3Nzg4NTAxODEuNTA2OTI5LCJleHAiOjQ5MzQ1MjM3ODEuNTAwMzk1LCJzdWIiOiIyMzYyNzkwIiwic2NvcGVzIjpbXX0.mpbnwI470EwOVOZ_PUNxckfqwA_E2kZzdr0cTKbtljvk3042obKxB_eXCTXEHn7j1EkstigFwcpVjGeWfHhXLbEx5kXfvPBztw2hUpPZgka148KeKc2KvfAEjjwW5TT7SQ9-jTlFoGDeeD_-JyCI9ttnJJqSR0_7msx-Zzo2xZtqu7xje2-wzrX6r67aZp0fFETl-wuCSR7s5moai1oLfjSLeaJ8yxnS0d8P1gSAXpC3naf78uCcwqzvXBc1pEa_VJE2Qh-lu4uN1rBnM2K2CPN6oG2lfzpjgYbM2XR9E-pR4dqW3iDKq7UFLqKwJV-kRHA_Lkn9t2ItwWiTJ0NkXetggPf8LpO9sNmVuYgh1P7OZZeHKPghSTkmdYDBFgF8gT5ZTUNS7UaijtnoJvSyQeQ_6Taha_iwa_DDHpzciwq7A0KjEYpM-yi8AXRjFHtwRU2DuYAvVNkhdr5L7piktOVK-dDo1wRiHmbo_LEFggfIRszkWE9AOPTIjbVyuwuBuZeIunSDYwYMA0qgvehxm6EQsy4CA5QLZoHnjH4hHXRDZbq4bAojQLfmafj_sXB1beFoGr9aCBTv9p_D07zX51yDDqWS924vzW8_i6OPIQH5-9I0A0gbTpd8bza1DzUeSewTj-9FltiFKNVy15kuOtNG1FFZL-XHHJzgmKOWq8o';

  try {
    // Add subscriber
    const subResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: { name: name || '' },
        groups: [groupId],
        status: 'active',
      }),
    });

    const data = await subResponse.json();

    if (!subResponse.ok) {
      console.error('MailerLite error:', data);
      return res.status(400).json({ error: data.message || 'Subscription failed' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
