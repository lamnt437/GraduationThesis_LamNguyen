const express = require("express");
const crypto = require("crypto");
const config = require("config");
const { json } = require("express");

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

module.exports = router;
