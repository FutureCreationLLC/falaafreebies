const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: { type: String },
  country: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
