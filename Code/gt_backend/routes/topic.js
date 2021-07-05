const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Topic = require('../models/Topic');

router.get('/:topicId', async (req, res) => {
  // validation
  const topicId = req.params.topicId;
  if (!mongoose.isValidObjectId(topicId)) {
    return res.status(404).json({ statusText: 'Topic not found' });
  }

  var topic = null;

  try {
    // find class
    topic = await Topic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ statusText: 'Topic not found' });
    }

    return res.json({ topic });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ statusText: 'Topic not found' });
    }
  }
});

module.exports = router;
