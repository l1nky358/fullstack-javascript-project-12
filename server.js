const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Загрузка данных
const loadData = () => {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
  return {
    channels: [
      { id: 1, name: 'general', removable: false },
      { id: 2, name: 'random', removable: false },
    ],
    nextChannelId: 3
  };
};

// Сохранение данных
const saveData = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

let db = loadData();

// API - без проверки токена для тестов
app.get('/api/v1/channels', (req, res) => {
  res.json(db.channels);
});

app.post('/api/v1/channels', (req, res) => {
  const { name } = req.body;
  const newChannel = { id: db.nextChannelId++, name, removable: true };
  db.channels.push(newChannel);
  saveData(db);
  res.status(201).json(newChannel);
});

app.patch('/api/v1/channels/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const channel = db.channels.find(ch => ch.id === parseInt(id));
  if (channel) {
    channel.name = name;
    saveData(db);
    res.json(channel);
  } else {
    res.status(404).json({ error: 'Channel not found' });
  }
});

app.delete('/api/v1/channels/:id', (req, res) => {
  const { id } = req.params;
  db.channels = db.channels.filter(ch => ch.id !== parseInt(id));
  saveData(db);
  res.json({ id: parseInt(id) });
});

// Логин без проверки
app.post('/api/v1/login', (req, res) => {
  res.json({ token: 'test-token-123', username: req.body.username });
});

app.post('/api/v1/signup', (req, res) => {
  res.json({ token: 'test-token-123', username: req.body.username });
});

app.get('/api/v1/messages', (req, res) => {
  res.json([]);
});

app.post('/api/v1/messages', (req, res) => {
  res.status(201).json(req.body);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
