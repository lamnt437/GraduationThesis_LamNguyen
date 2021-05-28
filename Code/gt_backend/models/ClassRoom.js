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

  requests: {
    type: [Schema.Types.ObjectId],
    ref: 'users',
  },

  posts: {
    type: [Schema.Types.ObjectId],
    ref: 'posts',
  },

  docs: {
    type: [
      {
        filename: String,
        link: String,
        created_at: Date,
        uploader: {
          type: Schema.Types.ObjectId,
          ref: 'users',
        },
      },
    ],
  },
});

module.exports = ClassRoom = mongoose.model('classrooms', ClassSchema);
