const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let channels = [
  { id: 1, name: 'general', removable: false },
  { id: 2, name: 'random', removable: true },
  { id: 3, name: 'tech', removable: true }
];

let messages = [
  { id: 1, text: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() }
];

// Получить каналы
app.get('/api/channels', (req, res) => {
  console.log('GET /api/channels');
  res.json(channels);
});

// Создать канал
app.post('/api/channels', (req, res) => {
  console.log('POST /api/channels', req.body);
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const newChannel = {
    id: channels.length + 1,
    name: name,
    removable: true
  };
  
  channels.push(newChannel);
  console.log('✅ Channel created:', newChannel);
  res.json(newChannel);
});

// Получить сообщения
app.get('/api/messages', (req, res) => {
  console.log('GET /api/messages');
  res.json(messages);
});

// Отправить сообщение
app.post('/api/messages', (req, res) => {
  console.log('POST /api/messages', req.body);
  const { text, channelId } = req.body;
  
  const newMessage = {
    id: messages.length + 1,
    text,
    channelId,
    username: 'User',
    createdAt: new Date().toISOString()
  };
  
  messages.push(newMessage);
  res.json(newMessage);
});

// Логин
app.post('/api/login', (req, res) => {
  console.log('POST /api/login', req.body);
  res.json({ token: 'test-token', username: req.body.username });
});

// Регистрация
app.post('/api/signup', (req, res) => {
  console.log('POST /api/signup', req.body);
  res.json({ token: 'test-token', username: req.body.username });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET  /api/channels`);
  console.log(`   POST /api/channels`);
  console.log(`   GET  /api/messages`);
  console.log(`   POST /api/messages`);
  console.log(`   POST /api/login`);
  console.log(`   POST /api/signup\n`);
});