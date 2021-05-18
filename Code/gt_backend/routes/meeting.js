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
const classroomDataAccess = require('../data_access/classroom');

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
// @desc  Fetch all related meetings to account
// @access Private
router.get('/', auth, async (req, res) => {
  const user = req.user;

  // find all related classroom
  var relatedClasses;
  try {
    relatedClasses = await classroomDataAccess.getRelatedClasses(user.id);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: 'Server error when fetching related classes' });
  }

  // get all class meetings
  var meeting_ids = [];
  relatedClasses.forEach((classroom) => {
    meeting_ids = meeting_ids.concat(classroom.meeting_ids);
  });

  // TODO find all personal meetings (user is the creator)
  try {
    const meetings = await Meeting.find({ _id: { $in: meeting_ids } });
    res.json({ meetings });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ msg: 'Server error when fetching related meetings' });
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

router.post('/schedule', auth, async (req, res) => {
  const { topic, start_time, password, duration, type } = req.body;
  const time = dateFormat(start_time, "yyyy-mm-dd'T'HH:MM:ssZ");

  let recurrence = {};
  if (type == 8) {
    recurrence = req.body.recurrence;
  }

  console.log({ recurrence });

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
  try {
    const zoomRes = await zoomService.createMeeting(
      topic,
      time,
      duration,
      password,
      type,
      recurrence,
      accessToken
    );

    let meeting = new Meeting({ ...zoomRes.data });
    console.log({ zoomRes: zoomRes.data });
    // meeting = { ...zoomRes.data };
    meeting.zoom_id = zoomRes.data.id;
    console.log({ meeting });
    if (meeting.type == 8) {
      meeting.duration = zoomRes.data.occurrences[0].duration;
      meeting.start_time = zoomRes.data.occurrences[0].start_time;
    }
    meeting.creator = req.user.id;
    meeting.save();
    res.json({ meeting });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error when creating meeting' });
  }
});

module.exports = router;
