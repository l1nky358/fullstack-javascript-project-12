const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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
  res.json({ id: 1, text: req.body.text, channelId: req.body.channelId });
});

app.post('/api/login', (req, res) => {
  res.json({ token: 'test-token', username: req.body.username });
});

app.post('/api/signup', (req, res) => {
  res.json({ token: 'test-token', username: req.body.username });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => process.exit(0));
});