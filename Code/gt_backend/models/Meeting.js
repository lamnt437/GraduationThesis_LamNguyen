const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
  // meeting info
  meeting_id: {
    type: String,
    required: true,
  },

  topic: {
    type: String
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
});

module.exports = Meeting = mongoose.model("meetings", MeetingSchema);
