const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const matchRoutes = require('./routes/matchRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/matches', matchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Findr.AI API - Campus Lost & Found Intelligence' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Findr.AI server running on port ${PORT}`);
});