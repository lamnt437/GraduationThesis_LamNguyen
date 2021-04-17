const express = require('express');
const crypto = require('crypto');
const config = require('config');
const { json } = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dateFormat = require('dateformat');
const Meeting = require('../models/Meeting');
const meetingService = require('../services/meeting');

const router = express.Router();
// const meetingController = require('../controllers/meeting_controller');

// router.get('/', meetingController.index);
// router.get('/create', meetingController.create);

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
  // Prevent time sync issue between client signature generation and zoom
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString(
    'base64'
  );
  const hash = crypto
    .createHmac('sha256', apiSecret)
    .update(msg)
    .digest('base64');
  const signature = Buffer.from(
    `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
  ).toString('base64');

  return signature;
}

// @route GET /api/meeting
// @access Public
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json({ meetings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
// console.log(generateSignature(process.env.API_KEY, process.env.API_SECRET, 123456789, 0))

// may add validation here
router.post('/signature', (req, res) => {
  const { meetingNumber, role } = req.body;

  const signature = generateSignature(
    config.get('zoomApiKey'),
    config.get('zoomApiSecret'),
    meetingNumber,
    role
  );

  return res.json(signature);
});

router.get('/token', (req, res) => {
  /* generate a token */
  const pl = {
    iss: config.get('zoomApiKey'),
  };

  jwt.sign(
    pl,
    config.get('zoomApiSecret'),
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      else res.json({ token });
    }
  );
});

// TODO add generate token before sending request
router.post('/schedule', async (req, res) => {
  const { topic, start_time, password } = req.body;
  const duration = 40;
  const time = dateFormat(start_time, "yyyy-mm-dd'T'HH:MM:ssZ");

  try {
    const response = await meetingService.createMeeting(
      topic,
      time,
      duration,
      password
    );
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
