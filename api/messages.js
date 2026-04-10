let messages = [
  { id: 1, text: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() },
]

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (req.method === 'GET') {
    console.log('GET /api/messages - returning:', messages)
    return res.json(messages)
  }
  if (req.method === 'POST') {
    console.log('=== POST /api/messages ===')
    console.log('Body:', req.body)
    const { text, channelId, username } = req.body
    if (!text || !channelId) {
      console.log('Missing fields!')
      return res.status(400).json({ error: 'Missing text or channelId' })
    }
    const newMessage = {
      id: messages.length + 1,
      text: text,
      channelId: channelId,
      username: username || 'Anonymous',
      createdAt: new Date().toISOString(),
    }
    messages.push(newMessage)
    console.log('New message created:', newMessage)
    console.log('All messages now:', messages)
    return res.status(201).json(newMessage)
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
