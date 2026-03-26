const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/channels', (req, res) => {
  res.json([{ id: 1, name: 'general', removable: false }]);
});

app.post('/api/login', (req, res) => {
  res.json({ token: 'test-token', username: req.body.username });
});

app.post('/api/signup', (req, res) => {
  res.json({ token: 'test-token', username: req.body.username });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
