const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const ClassRoom = require('../models/ClassRoom');
const mongoose = require('mongoose');

// @route   POST /api/posts
// @desc    create new post
// @access  Private

router.post(
  '/',
  auth,
  [
    body('text', 'Please enter content with 6 or more characters')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // get user name, avatar
      const user = await User.findById(req.user.id).select('-password');
      const { name, avatar } = user;
      const text = req.body.text;
      // create and save new post
      const newPost = new Post({
        user: req.user.id,
        name: name,
        avatar: avatar,
        text: text,
      });

      await newPost.save();
      // return new post json
      res.json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route GET /api/posts
// @desc get all posts
// @access Public
router.get('/', async (req, res) => {
  try {
    let posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route GET /api/posts
// @desc get all posts
// @access Public
router.get('/:id', async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    // get post
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // compare post owner id with user id
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized delete' });
    }
    // delete
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// route  PUT /api/posts/:postId/comment
// desc   comment on post
// access Private related
// TODO only user from classroom can like post
router.put(
  '/:postId/comment',
  auth,
  [
    body('text', 'Bình luận phải có ít nhất 1 ký tự').isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    // check if post exists
    const postId = req.params.postId;
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(404).json({ statusText: 'Post not found' });
    }

    var post = null;

    try {
      // find post
      post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ statusText: 'Post not found' });
      }
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ statusText: 'Post not found' });
      }
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var user = req.user;
    var userObj = null;
    try {
      userObj = await User.findById(user.id);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ textStatus: 'Error fetching user' });
    }

    const newComment = {
      user: user.id,
      text: req.body.text,
      username: userObj.name,
      _id: mongoose.Types.ObjectId(),
    };

    try {
      post.comments.push(newComment);
      post.save();
      return res.json({ comment: newComment });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ statusText: err.message });
    }
  }
);

module.exports = router;
