const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Хранилище данных (сохраняется между запросами)
let channels = [
  { id: 1, name: 'general', removable: false },
  { id: 2, name: 'random', removable: false },
];
let nextId = 3;

// API маршруты
app.get('/api/v1/channels', (req, res) => {
  res.json(channels);
});

app.post('/api/v1/channels', (req, res) => {
  const { name } = req.body;
  const newChannel = { id: nextId++, name, removable: true };
  channels.push(newChannel);
  res.status(201).json(newChannel);
});

app.patch('/api/v1/channels/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const channel = channels.find(ch => ch.id === parseInt(id));
  if (channel) {
    channel.name = name;
    res.json(channel);
  } else {
    res.status(404).json({ error: 'Channel not found' });
  }
});

app.delete('/api/v1/channels/:id', (req, res) => {
  const { id } = req.params;
  channels = channels.filter(ch => ch.id !== parseInt(id));
  res.json({ id: parseInt(id) });
});

app.post('/api/v1/login', (req, res) => {
  const { username, password } = req.body;
  res.json({ token: 'mock-token', username });
});

app.post('/api/v1/signup', (req, res) => {
  const { username, password } = req.body;
  res.json({ token: 'mock-token', username });
});

app.get('/api/v1/messages', (req, res) => {
  res.json([]);
});

app.post('/api/v1/messages', (req, res) => {
  res.status(201).json(req.body);
});

// Статика для фронтенда
app.use(express.static('frontend/dist'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
