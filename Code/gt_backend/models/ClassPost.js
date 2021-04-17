const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassPostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },

  text: {
    type: String,
    required: true,
  },
});

module.exports = ClassPost = mongoose.model('classpost', ClassPostSchema);
