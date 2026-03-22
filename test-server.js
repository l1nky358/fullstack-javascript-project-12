const express = require('express');
const app = express();

console.log('🔥🔥🔥 TEST SERVER STARTING 🔥🔥🔥');

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

let channels = [
  { id: 1, name: 'general', removable: false },
  { id: 2, name: 'random', removable: true },
  { id: 3, name: 'tech', removable: true }
];

let messages = [];

app.get('/api/channels', (req, res) => {
  console.log('📡 GET /api/channels - returning:', channels);
  res.json(channels);
});

app.post('/api/channels', (req, res) => {
  const { name } = req.body;
  const newChannel = {
    id: channels.length + 1,
    name,
    removable: true
  };
  channels.push(newChannel);
  console.log('✅ Channel created:', newChannel);
  res.json(newChannel);
});

app.get('/api/messages', (req, res) => {
  console.log('📡 GET /api/messages - returning:', messages.length, 'messages');
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { text, channelId } = req.body;
  const newMessage = {
    id: messages.length + 1,
    text,
    channelId,
    username: req.user?.username || 'test-user',
    createdAt: new Date()
  };
  messages.push(newMessage);
  console.log('✅ Message created:', newMessage);
  res.json(newMessage);
});

app.post('/api/login', (req, res) => {
  console.log('📡 POST /api/login', req.body);
  res.json({ token: 'test-token', username: req.body.username });
});

app.post('/api/signup', (req, res) => {
  console.log('📡 POST /api/signup', req.body);
  res.json({ token: 'test-token', username: req.body.username });
});

app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token === 'test-token' || !token) {
    req.user = { username: 'test-user' };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅✅✅ TEST SERVER RUNNING ON http://0.0.0.0:${PORT} ✅✅✅`);
});
