const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// Create item
router.post('/', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

// Get items by country
router.get('/:country', async (req, res) => {
  const items = await Item.find({ country: req.params.country });
  res.json(items);
});

module.exports = router;
