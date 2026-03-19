const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/api/test', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/channels', (req, res) => {
  res.json([
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: true }
  ]);
});

app.get('/api/messages', (req, res) => {
  res.json([]);
});

app.post('/api/login', (req, res) => {
  res.json({ token: 'test-token', username: req.body.username });
});

app.post('/api/signup', (req, res) => {
  res.json({ token: 'test-token', username: req.body.username });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
});