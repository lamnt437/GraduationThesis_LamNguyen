const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  text: {
    type: String,
    required: true,
  },

  classId: {
    type: Schema.Types.ObjectId,
    ref: 'classrooms',
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Topic = mongoose.model('topics', TopicSchema);
