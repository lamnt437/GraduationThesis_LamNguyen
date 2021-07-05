const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { CLASS_POST_TYPE_NORMAL } = require('../config/constants');

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },

  text: {
    type: String,
  },

  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],

  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        type: String,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      username: {
        type: String,
      },
    },
  ],

  image: {
    type: String,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

  type: {
    type: Number,
    default: CLASS_POST_TYPE_NORMAL,
  },

  meeting: {
    zoom_id: String,
    password: String,
    topic: String,
    start_url: String,
    start_time: Date,
    classroom: String,
  },

  username: {
    type: String,
  },

  topic: {
    type: Schema.Types.ObjectId,
    ref: 'topics',
  },
});

module.exports = Post = mongoose.model('posts', PostSchema);
