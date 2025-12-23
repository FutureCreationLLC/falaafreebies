const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true
  },

  password: { type: String, required: true },

  country: { type: String, required: false, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
