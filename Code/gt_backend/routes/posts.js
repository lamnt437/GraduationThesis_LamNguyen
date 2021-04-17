const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');

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

module.exports = router;
