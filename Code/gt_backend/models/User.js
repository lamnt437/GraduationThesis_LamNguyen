const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  read_notifications: {
    type: [
      {
        class_id: {
          type: Schema.Types.ObjectId,
          ref: 'classrooms',
        },
        notification_id: {
          type: Schema.Types.ObjectId,
          ref: 'notifications',
        },
      },
    ],
  },
});

module.exports = User = mongoose.model('users', UserSchema);
