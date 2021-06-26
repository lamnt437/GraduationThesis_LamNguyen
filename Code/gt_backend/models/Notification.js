const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },

  username: {
    type: String,
  },

  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'classrooms',
  },

  classname: {
    type: String,
  },

  text: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Notification = mongoose.model(
  'notifications',
  NotificationSchema
);
