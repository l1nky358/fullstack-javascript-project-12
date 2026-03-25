export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    console.log('POST /api/login', req.body);
    const { username } = req.body;
    
    return res.json({ 
      token: 'test-token-' + Date.now(), 
      username: username 
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}