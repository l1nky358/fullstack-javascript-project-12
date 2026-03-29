const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/channels', (req, res) => {
  res.json([{ id: 1, name: 'general', removable: false }]);
});

app.post('/api/channels', (req, res) => {
  res.json({ id: 2, name: req.body.name, removable: true });
});

app.get('/api/messages', (req, res) => {
  res.json([]);
});

app.post('/api/messages', (req, res) => {
  res.json({ id: 1, text: req.body.text, channelId: req.body.channelId, username: 'User' });
});

app.post('/api/login', (req, res) => {
  res.json({ token: 'test-token-' + Date.now(), username: req.body.username });
});

app.post('/api/signup', (req, res) => {
  res.json({ token: 'test-token-' + Date.now(), username: req.body.username });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`   Health check: http://0.0.0.0:${PORT}/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...');
  server.close(() => process.exit(0));
});