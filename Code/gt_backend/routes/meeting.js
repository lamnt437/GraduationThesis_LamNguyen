const express = require("express");
const crypto = require("crypto");
const config = require("config");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dateFormat = require("dateformat");
const Meeting = require("../models/Meeting");

const router = express.Router();
// const meetingController = require('../controllers/meeting_controller');

// router.get('/', meetingController.index);
// router.get('/create', meetingController.create);

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
  // Prevent time sync issue between client signature generation and zoom
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString(
    "base64"
  );
  const hash = crypto
    .createHmac("sha256", apiSecret)
    .update(msg)
    .digest("base64");
  const signature = Buffer.from(
    `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
  ).toString("base64");

  return signature;
}

// @route GET /api/meeting
// @access Public
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json({ meetings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
// console.log(generateSignature(process.env.API_KEY, process.env.API_SECRET, 123456789, 0))

// may add validation here
router.post("/signature", (req, res) => {
  const { meetingNumber, role } = req.body;

  const signature = generateSignature(
    config.get("zoomApiKey"),
    config.get("zoomApiSecret"),
    meetingNumber,
    role
  );

  return res.json(signature);
});

router.get("/token", (req, res) => {
  /* generate a token */
  const pl = {
    iss: config.get("zoomApiKey"),
  };

  jwt.sign(
    pl,
    config.get("zoomApiSecret"),
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      else res.json({ token });
    }
  );
});

// TODO add generate token before sending request
router.post("/schedule", (req, res) => {
  const { topic, start_time, password } = req.body;
  const time = dateFormat(start_time, "yyyy-mm-dd'T'HH:MM:ssZ");

  // return res.json({ time });

  let payload = {
    duration: 40,
    start_time: time,
    timezone: "Asia/Saigon",
    topic,
    type: 2,
    password,
  };

  // 2019-08-30T22:00:00Z

  console.log(payload);
  const AccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrTjRPT2MyRlNzZUJuRU9YWVMzNXBnIiwiaWF0IjoxNjE3MjQwNTUwLCJleHAiOjE2MTc2MDA1NTB9.DcvTnhxFly5MNeiTuWc0O5D0z_cKcnBktm4svH6Dpfs";
  /* generate a token */
  // const pl = {
  //   iss: config.get("zoomApiKey"),
  // };

  // jwt.sign(
  //   pl,
  //   config.get("zoomApiSecret"),
  //   { expiresIn: 360000 },
  //   (err, token) => {
  //     if (err) throw err;
  //     else res.json({ token });
  //   }
  // );
  const apiUrl = "https://api.zoom.us/v2/users/me/meetings";

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AccessToken}`,
    },
  };

  axios
    .post(apiUrl, payload, options)
    .then(async (response) => {
      // save meeting to database
      // return response success create meeting
      console.log(response.data);
      // const { savedId, savedStartTime, savedPassword }
      const savedId = response.data.id;
      const savedStartTime = response.data.start_time;
      const savedPassword = response.data.password;

      const newMeeting = new Meeting({
        meeting_id: savedId,
        start_time: savedStartTime,
        password: savedPassword,
      });

      try {
        await newMeeting.save();
        const exactTime = dateFormat(
          newMeeting.start_time,
          "yyyy-mm-dd'T'HH:MM:ssZ"
        );
        res.json({ exactTime });
      } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server error" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.send("Unexpected error!");
    });
});

module.exports = router;
