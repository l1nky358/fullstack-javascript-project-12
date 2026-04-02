import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

let users = [
  { id: 1, username: 'admin', password: 'admin' }
];
let channels = [
  { id: 1, name: 'general', removable: false }
];
let messages = [];
let nextChannelId = 2;
let nextMessageId = 1;
let nextUserId = 2;

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: nextUserId++,
    username,
    password
  };
  users.push(newUser);
  
  res.json({ token: `fake-jwt-token-${newUser.id}` });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ token: `fake-jwt-token-${user.id}` });
});

app.get('/api/channels', (req, res) => {
  res.json(channels);
});

app.post('/api/channels', (req, res) => {
  const { name } = req.body;
  const newChannel = {
    id: nextChannelId++,
    name,
    removable: true
  };
  channels.push(newChannel);

  io.emit('channelCreated', newChannel);
  
  res.json(newChannel);
});

app.patch('/api/channels/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const channelId = parseInt(id);
  
  const channel = channels.find(c => c.id === channelId);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  channel.name = name;
  
  io.emit('channelRenamed', channel);
  
  res.json(channel);
});

app.delete('/api/channels/:id', (req, res) => {
  const { id } = req.params;
  const channelId = parseInt(id);
  
  const channel = channels.find(c => c.id === channelId);
  if (channel && channel.removable === false) {
    return res.status(400).json({ error: 'Cannot remove general channel' });
  }
  
  channels = channels.filter(c => c.id !== channelId);
  messages = messages.filter(m => m.channelId !== channelId);
  
  io.emit('channelRemoved', channelId);
  
  res.json({ success: true });
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { channelId, body, username } = req.body;
  const newMessage = {
    id: nextMessageId++,
    channelId: parseInt(channelId),
    body,
    username,
    createdAt: new Date().toISOString()
  };
  messages.push(newMessage);
  
  io.emit('newMessage', newMessage);
  
  res.json(newMessage);
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'running' });
});

io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('message', (data) => {
    io.emit('message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
  console.log(`➜ http://localhost:${PORT}`);
});
