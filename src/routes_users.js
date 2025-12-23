const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, country } = req.body;
    if (!name || !password) return res.status(400).json({ error: 'Name and password required' });

    // check existing by email or phone
    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) return res.status(400).json({ error: 'User with that email or phone already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email: email || null, phone: phone || null, password: hashed, country: country || '' });
    await user.save();

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // send back user (without password) and token
    const userObj = { _id: user._id, name: user.name, email: user.email, phone: user.phone, country: user.country };
    res.status(201).json({ message: 'User created', user: userObj, token });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const userObj = { _id: user._id, name: user.name, email: user.email, phone: user.phone, country: user.country };
    res.json({ message: 'Login successful', user: userObj, token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get users by country (optional)
router.get('/country/:country', async (req, res) => {
  try {
    const users = await User.find({ country: req.params.country }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
