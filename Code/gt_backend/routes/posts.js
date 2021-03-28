const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Post = require("../models/Post");

// @route   POST /api/posts
// @desc    create new post
// @access  Private

router.post(
  "/",
  auth,
  [
    body("text", "Please enter content with 6 or more characters")
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
      const user = await User.findById(req.user.id).select("-password");
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
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
