const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/channels', (req, res) => {
  res.json([
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: true }
  ]);
});

app.post('/api/channels', (req, res) => {
  res.json({ id: 3, name: req.body.name, removable: true });
});

app.get('/api/messages', (req, res) => {
  res.json([]);
});

app.post('/api/messages', (req, res) => {
  res.json({
    id: 1,
    text: req.body.text,
    channelId: req.body.channelId,
    username: 'User',
    createdAt: new Date().toISOString()
  });
});

app.post('/api/login', (req, res) => {
  const { username } = req.body;
  res.json({ token: `test-token-${Date.now()}`, username });
});

app.post('/api/signup', (req, res) => {
  const { username } = req.body;
  res.json({ token: `test-token-${Date.now()}`, username });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
