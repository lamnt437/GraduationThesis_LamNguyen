const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('config');
const auth = require('../middleware/auth');

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
    // create authString
    const clientId = config.get('zoomClientId');
    const clientSecret = config.get('zoomClientSecret');
    const decodedString = `${clientId}:${clientSecret}`;
    // const authString = btoa(decodedString);
    const authString = Buffer.from(decodedString).toString('base64');
    // console.log({ authString });
    // TODO send code, client key, client secret in zoom convention
    const url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/profile`;
    const reqConfig = {
      headers: {
        Authorization: `Basic ${authString}`,
      },
    };

    // to zoom server to get token and refresh token
    const zoomRes = await axios.post(url, {}, reqConfig);

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

module.exports = router;
