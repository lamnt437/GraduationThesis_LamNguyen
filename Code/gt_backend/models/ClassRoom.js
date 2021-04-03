const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  owners: {
    type: [Schema.Types.ObjectId],
    ref: "users",
  },

  meetings: {
    type: [Schema.Types.ObjectId],
    refs: "meetings",
  },

  members: {
    type: [Schema.Types.ObjectId],
    refs: "users",
  },
});

module.exports = ClassRoom = mongoose.model("classrooms", ClassSchema);
