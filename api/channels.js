let channels = [
  { id: 1, name: 'general', removable: false },
  { id: 2, name: 'random', removable: false },
  { id: 3, name: 'tech', removable: true }
]

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (req.method === 'GET') {
    console.log('GET /api/channels')
    return res.json(channels)
  }
  if (req.method === 'POST') {
    console.log('POST /api/channels', req.body)
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const newChannel = {
      id: channels.length + 1,
      name: name,
      removable: true,
    }
    channels.push(newChannel)
    return res.status(201).json(newChannel)
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
