require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow JSON
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoutes);
app.use('/items', itemRoutes);

// Connect DB and start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });