const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  school: { type: String, default: "", trim: true },
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
