const mongoose = require('mongoose');

// @module  User model
// connect to db
// add user schema
// return user model

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
