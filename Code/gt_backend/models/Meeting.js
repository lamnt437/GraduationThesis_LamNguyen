const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
  // meeting info
  meeting_id: {
    type: String,
    required: true,
  },

  start_time: {
    type: Date,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

module.exports = Meeting = mongoose.model("meetings", MeetingSchema);
