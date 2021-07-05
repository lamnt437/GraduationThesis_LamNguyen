const User = require('../models/User');
const ClassRoom = require('../models/ClassRoom');
const Post = require('../models/Post');
const mongoose = require('mongoose');
const {
  ROLE_STUDENT,
  ROLE_TEACHER,
  ROLE_ADMIN,
} = require('../config/constants');

// @module  Auth
// @desc    Authenticate user
module.exports = async (req, res, next) => {
  // get token from header
  const userId = mongoose.Types.ObjectId(req.user.id);
  const postId = mongoose.Types.ObjectId(req.params.postId);
  // get class of this post

  var user;
  var post;
  var classroom;
  try {
    post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ statusText: 'Post not found' });
    }
  } catch (err) {
    return res.status(404).json({ statusText: 'Post not found' });
  }
  console.log({ post });

  try {
    user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ statusText: 'User not found' });
    }
  } catch (err) {
    return res.status(404).json({ statusText: 'User not found' });
  }

  try {
    classroom = await ClassRoom.find({ posts: postId });
    if (!classroom) {
      return res.status(404).json({ statusText: 'Classroom not found' });
    }
  } catch (err) {
    return res.status(404).json({ statusText: 'Classroom not found' });
  }

  req.username = user.name;
  req.classname = classroom.name;
  req.post = post;

  if (post.user.toString() == user._id.toString()) return next();

  if (user.role === ROLE_TEACHER && classroom.supervisor_ids.includes(userId)) {
    req.username = user.name;
    req.classname = classroom.name;
    return next();
  }

  if (user.role === ROLE_ADMIN) return next();

  return res.status(403).json({ statusText: 'Unauthorized' });
};
