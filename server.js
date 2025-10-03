const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', feature: 'authentication' });
});

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});

module.exports = app;
