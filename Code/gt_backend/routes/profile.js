const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('config');
const auth = require('../middleware/auth');
const zoomService = require('../services/meetingOAuth');
const { ERROR_NO_OAUTH } = require('../config/errorCodes');

// route    GET /api/profile
// desc     get current user profile
// access   Private
router.get('/', auth, async (req, res) => {
  const user = req.user;
  if (!mongoose.isValidObjectId(user.id)) {
    return res.status(404).json({ msg: 'User not found' });
  }

  try {
    const profile = await User.find({ _id: user.id }, { password: 0 });
    // console.log(profile);
    res.json({ profile });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'User not found' });
    }
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// route    PUT /api/profile/zoom
// desc     add oauth authorization to account
// access   Private
router.put('/zoom', auth, async (req, res) => {
  // console.log(req);
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ msg: 'Zoom Authorization code is required' });
  }

  // send code to zoom
  try {
    const zoomRes = await zoomService.getAccessToken(code);

    const access_token = zoomRes.data.access_token;
    const refresh_token = zoomRes.data.refresh_token;

    // save them to user profile
    const user = req.user;
    const profile = await User.findById(user.id);
    console.log(profile);
    profile.access_token = access_token;
    profile.refresh_token = refresh_token;
    profile.save();

    res.json({ access_token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// route    PUT /api/profile/zoom/refresh
// desc     refresh oauth authorization to account
// reqBody  {}
// access   Private
router.put('/zoom/refresh', auth, async (req, res) => {
  try {
    // get refresh token from account
    const profile = await User.findById(req.user.id);
    // check if has refresh token
    if (!profile.refresh_token) {
      return res.status(403).json({
        msg: "Account hasn't connected to zoom service",
        error_code: ERROR_NO_OAUTH,
      });
    }

    // request new token
    const refreshToken = profile.refresh_token;
    const zoomRes = await zoomService.refreshAccessToken(refreshToken);

    const access_token = zoomRes.data.access_token;

    // save new access token to user profile
    profile.access_token = access_token;
    profile.save();

    res.json({ access_token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/zoom/revoke/:token', async (req, res) => {
  const token = req.params.token;

  try {
    const verification = await zoomService.isValidToken(token);

    if (verification) {
      res.json({ msg: 'OK' });
    } else {
      res.json({ msg: 'not OK' });
    }
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
