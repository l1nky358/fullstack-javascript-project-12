const express = require('express');
const app = express();

console.log('🔥🔥🔥 TEST SERVER STARTING 🔥🔥🔥');
console.log('📂 Working directory:', process.cwd());
console.log('📦 Node version:', process.version);
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT || 5001);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

app.get('/api/test', (req, res) => {
  console.log('✅ GET /api/test');
  res.json({ status: 'ok' });
});

app.get('/api/channels', (req, res) => {
  console.log('📡 GET /api/channels');
  res.json([
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: true }
  ]);
});

app.get('/api/messages', (req, res) => {
  console.log('📡 GET /api/messages');
  res.json([]);
});

app.post('/api/login', (req, res) => {
  console.log('📡 POST /api/login', req.body);
  res.json({ token: 'test-token', username: req.body.username });
});

app.post('/api/signup', (req, res) => {
  console.log('📡 POST /api/signup', req.body);
  res.json({ token: 'test-token', username: req.body.username });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅✅✅ TEST SERVER RUNNING ON http://0.0.0.0:${PORT} ✅✅✅`);
  console.log(`🌐 Test endpoint: http://localhost:${PORT}/api/test`);
});

server.on('error', (err) => {
  console.error('❌❌❌ SERVER ERROR:', err);
});

process.on('SIGTERM', () => {
  console.log('📡 SIGTERM received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
  });
});

process.on('SIGINT', () => {
  console.log('📡 SIGINT received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
  });
});