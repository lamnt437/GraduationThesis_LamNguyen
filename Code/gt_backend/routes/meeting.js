const express = require('express');
const crypto = require('crypto');
const config = require('config');
const { json } = require('express');
const jwt = require('jsonwebtoken');
const dateFormat = require('dateformat');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const meetingService = require('../services/meeting');
const auth = require('../middleware/auth');
const zoomService = require('../services/meetingOAuth');
const { ERROR_NO_OAUTH } = require('../config/errorCodes');

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
router.post('/schedule', auth, async (req, res) => {
  const { topic, start_time, password } = req.body;
  const duration = 40;
  const time = dateFormat(start_time, "yyyy-mm-dd'T'HH:MM:ssZ");

  /* PREVIOUS THOUGHTS */
  // check if user has one (connected to zoom oauth service)
  // if no token, then return error code, so that front end can notify user about
  // requirement to authorize
  // check if token is valid
  // yes, then proceed
  // no, then use refresh token

  // get token
  // check if user connected to zoom service
  console.log(req.user);
  const profile = await User.findById(req.user.id);

  var accessToken = profile.access_token;
  if (!accessToken) {
    return res.status(403).json({
      msg: "Account hasn't connected to zoom service",
      error_code: ERROR_NO_OAUTH,
    });
  }

  // // validate token
  // try {
  //   const isValidToken = await zoomService.isValidToken(accessToken);
  //   // console.log(verification.data);
  //   if (!isValidToken) {
  //     // refresh token
  //     const refreshToken = profile.refresh_token;
  //     const refreshRes = await zoomService.refreshAccessToken(refreshToken);
  //     console.log({ refreshRes });
  //     accessToken = refreshRes.data.access_token;
  //     console.log({ newAccessToken: accessToken });

  //     // save token to account
  //     profile.access_token = accessToken;
  //     profile.save();
  //     console.log({ refreshProfile: profile });
  //   }
  // } catch (err) {
  //   console.error(err.message);
  //   return res.status(500).json({ msg: 'Error while refresh access token' });
  // }

  // validate token
  const isValid = zoomService.isValidToken(accessToken);

  if (!isValid) {
    try {
      // need refresh
      console.log('Refreshing.............................');
      // get refresh token from profile
      const refreshToken = profile.refresh_token;
      console.log({ refreshToken });

      // run refreshAccessToken service
      const zoomRes = await zoomService.refreshAccessToken(refreshToken);
      accessToken = zoomRes.data.access_token;

      // save token to account
      profile.access_token = accessToken;
      profile.refresh_token = zoomRes.data.refresh_token;
      profile.save();

      console.log({ newAccessToken: accessToken });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Error while refresh access token' });
    }
  }

  // send request
  console.log({ accessToken });
  try {
    const response = await zoomService.createMeeting(
      topic,
      time,
      duration,
      password,
      accessToken
    );

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
