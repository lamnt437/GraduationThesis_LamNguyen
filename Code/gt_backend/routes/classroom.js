const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const axios = require("axios");
const ClassRoom = require("../models/ClassRoom");
const auth = require("../middleware/auth");
const dateFormat = require("dateformat");
const zoomApi = require("../services/zoomapi");

// router.get("/", (req, res) => {});

// @route POST /api/classroom
// @desc create a new classroom
// @access Private to teacher
router.post(
  "/",
  auth,
  body("name", "Name should not be empty").not().isEmpty(),
  async (req, res) => {
    // validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const user = req.user.id;

    // create classroom object
    const classRoom = new ClassRoom({
      owners: user,
      name,
      description,
    });
    // save to database

    try {
      await classRoom.save();
      res.json({ classRoom });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// @route GET /api/classroom
// @desc get all classes available
//
router.get("/", async (req, res) => {
  try {
    const classes = await ClassRoom.find();
    res.json(classes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const classroom = await ClassRoom.findById(req.params.id);
    res.json({ classroom });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Classroom not found" });
    }

    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/classroom/:id/meetings
// @desc    get all meetings of the current class
// @access  Private
router.get("/:id/meetings", async (req, res) => {
  try {
    const classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    res.json({ meetings: classroom.meetings });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Classroom not found" });
    }

    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route PUT /api/classroom/:id/posts
// @desc create a new post in classroom
// @access TODO Private to class member
router.put(
  "/:id/meetings",
  [
    body("topic", "Please enter meeting topic").exists(),
    body("start_time", "Please enter a valid time").exists(),
    body("duration", "Please enter a valid duration").isNumeric(),
    body("password", "Please enter password with 6 characters").isLength(6),
  ],
  async (req, res) => {
    try {
      const classRoom = await ClassRoom.findById(req.params.id);
      if (!classRoom) {
        return res.status(404).json({ msg: "Classroom not found" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { topic, start_time, duration, password } = req.body;
      const time = dateFormat(start_time, "yyyy-mm-dd'T'HH:MM:ssZ");
      // validate info
      // validate date using parser
      // get meeting data from body of request
      let payload = {
        duration: 40,
        start_time: time,
        timezone: "Asia/Saigon",
        duration,
        topic,
        type: 2,
        password,
      };

      const AccessToken = await zoomApi.generateToken();
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
          const savedId = response.data.id;
          const savedStartTime = response.data.start_time;
          const savedPassword = response.data.password;

          const newMeeting = new Meeting({
            meeting_id: savedId,
            start_time: savedStartTime,
            password: savedPassword,
            duration,
            topic,
          });

          try {
            // save meeting info to database
            await newMeeting.save();
            const exactTime = dateFormat(
              newMeeting.start_time,
              "yyyy-mm-dd'T'HH:MM:ssZ"
            );

            // save meeting id into class
            const meeting_id = newMeeting.id;
            classRoom.meetings.push(meeting_id);
            await classRoom.save();

            res.json({
              meeting: {
                db_id: newMeeting.id,
                data: response.data,
              },
            });
          } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server error" });
          }
        })
        .catch((error) => {
          console.error(error.message);
          res.send("Error when sending request to Zoom Cloud");
        });
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Classroom not found" });
      }
      console.error(err.message);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);

// @route /api/classroom/:id/members
// @desc  add members to class
// @access
router.put("/:id/members", async (req, res) => {
  try {
    // check if this member exists
    // unshift to array
    // save
  } catch (error) {}
});

module.exports = router;
