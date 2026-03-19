const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

console.log('🚀 Starting test server...');
console.log(`📡 Node version: ${process.version}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/channels', (req, res) => {
  console.log('📡 GET /api/channels');
  res.json([]);
});

app.get('/api/messages', (req, res) => {
  console.log('📡 GET /api/messages');
  res.json([]);
});

app.post('/api/login', (req, res) => {
  console.log('📡 POST /api/login');
  res.json({ token: 'test-token', username: req.body.username });
});

app.post('/api/signup', (req, res) => {
  console.log('📡 POST /api/signup');
  res.json({ token: 'test-token', username: req.body.username });
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected');
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}/api/test`);
});