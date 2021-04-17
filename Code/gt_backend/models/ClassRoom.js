const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  meeting_ids: {
    type: [Schema.Types.ObjectId],
    refs: 'meetings',
  },

  member_ids: {
    type: [Schema.Types.ObjectId],
    refs: 'users',
  },

  supervisor_ids: {
    type: [Schema.Types.ObjectId],
    ref: 'users',
  },

  posts: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },

      text: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = ClassRoom = mongoose.model('classrooms', ClassSchema);
