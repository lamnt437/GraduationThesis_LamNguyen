const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
  // meeting info
  zoom_id: {
    type: String,
    required: true,
  },

  topic: {
    type: String,
  },

  start_time: {
    type: Date,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  type: {
    type: Number,
  },

  timezone: {
    type: String,
  },

  created_at: {
    type: Date,
  },

  start_url: {
    type: String,
  },

  join_url: {
    type: String,
  },

  recurrence: {
    type: {
      type: Number,
    },

    repeat_interval: {
      type: Number,
    },

    weekly_days: {
      type: String,
    },

    end_times: {
      type: Number,
    },
  },
});

module.exports = Meeting = mongoose.model('meetings', MeetingSchema);
