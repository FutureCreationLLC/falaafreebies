const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// POST /items
// Uses auth and multipart/form-data with field "image"
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, country } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const newItem = new Item({
      title,
      description: description || '',
      image: req.file?.path || null, // Cloudinary URL
      country: country || '',
      postedBy: req.user.id
    });

    await newItem.save();
    // populate postedBy minimally
    const populated = await newItem.populate('postedBy', 'name email phone');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create item error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /items/country/:country
router.get('/country/:country', async (req, res) => {
  try {
    const items = await Item.find({ country: req.params.country }).populate('postedBy', 'name email phone');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;