const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  country: String,
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
