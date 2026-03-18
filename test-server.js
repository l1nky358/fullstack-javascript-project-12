const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

let channels = [
  { id: 1, name: 'general', removable: false },
  { id: 2, name: 'random', removable: true },
  { id: 3, name: 'tech', removable: true }
];

let messages = [
  { id: 1, text: 'Welcome!', channelId: 1, username: 'System', createdAt: new Date() }
];

app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token === 'test-token' || !token) {
    req.user = { username: 'test-user' };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    res.json({ token: 'test-token', username });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (username === 'existing') {
    res.status(409).json({ error: 'User exists' });
  } else {
    res.json({ token: 'test-token', username });
  }
});

app.get('/api/channels', (req, res) => {
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
  io.emit('newChannel', newChannel);
  res.json(newChannel);
});

app.patch('/api/channels/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const channel = channels.find(c => c.id === parseInt(id));
  if (channel) {
    channel.name = name;
    io.emit('renameChannel', channel);
    res.json(channel);
  } else {
    res.status(404).json({ error: 'Channel not found' });
  }
});

app.delete('/api/channels/:id', (req, res) => {
  const { id } = req.params;
  channels = channels.filter(c => c.id !== parseInt(id));
  messages = messages.filter(m => m.channelId !== parseInt(id));
  io.emit('removeChannel', parseInt(id));
  res.json({ success: true });
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { text, channelId } = req.body;
  const newMessage = {
    id: messages.length + 1,
    text,
    channelId,
    username: req.user.username,
    createdAt: new Date()
  };
  messages.push(newMessage);
  io.emit('newMessage', newMessage);
  res.json(newMessage);
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});