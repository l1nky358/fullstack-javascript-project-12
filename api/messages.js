let messages = [
  { id: 1, text: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() }
];

let nextId = 2;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    console.log('GET /api/messages');
    return res.json(messages);
  }
  
  if (req.method === 'POST') {
    console.log('POST /api/messages', req.body);
    const { text, channelId, username } = req.body;
    
    const newMessage = {
      id: nextId++,
      text,
      channelId,
      username: username || 'User',
      createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    return res.json(newMessage);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
