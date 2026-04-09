const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Загрузка данных из файла
const loadData = () => {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
  return {
    channels: [
      { id: 1, name: 'general', removable: false },
      { id: 2, name: 'random', removable: false },
    ],
    nextId: 3
  };
};

// Сохранение данных в файл
const saveData = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

let db = loadData();

// API маршруты
app.get('/api/v1/channels', (req, res) => {
  res.json(db.channels);
});

app.post('/api/v1/channels', (req, res) => {
  const { name } = req.body;
  const newChannel = { id: db.nextId++, name, removable: true };
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

app.post('/api/v1/login', (req, res) => {
  const { username, password } = req.body;
  res.json({ token: 'mock-token-' + Date.now(), username });
});

app.post('/api/v1/signup', (req, res) => {
  const { username, password } = req.body;
  res.json({ token: 'mock-token-' + Date.now(), username });
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
  console.log(`📁 Data saved to ${DB_FILE}`);
});
