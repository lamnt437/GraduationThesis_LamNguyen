const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const ClassRoom = require('../models/ClassRoom');
const auth = require('../middleware/auth');
const dateFormat = require('dateformat');
const zoomApi = require('../services/zoomapi');
const { ROLE_TEACHER, ROLE_ADMIN } = require('../config/constants');
const User = require('../models/User');
const classroomDataAccess = require('../data_access/classroom');

// @route /api/classroom
// desc get all classes
// access Private
router.get('/', auth, async (req, res) => {
  if (req.user.role !== ROLE_ADMIN) {
    try {
      const classrooms = await classroomDataAccess.getRelatedClasses(
        req.user.id
      );
      return res.json({ classrooms });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }

  try {
    const classrooms = await ClassRoom.find();
    res.json({ classrooms });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route /api/classroom
// desc class by id
// access Private members + admin
router.get('/:id', auth, async (req, res) => {
  try {
    // get classrooom
    const classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }
    // check if user is supervisor or member
    const user = req.user;

    if (
      user.role !== ROLE_ADMIN &&
      !classroom.supervisor_ids.includes(user.id) &&
      !classroom.member_ids.includes(user.id)
    ) {
      return res.status(401).json({ msg: 'Access denied' });
    }

    res.json({ classroom });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route POST /api/classroom
// @desc create a new classroom
// @access Private to teacher
router.post(
  '/',
  auth,
  body('name', 'Name should not be empty').not().isEmpty(),
  async (req, res) => {
    // validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const user = req.user;

    if (user.role !== ROLE_TEACHER) {
      return res
        .status(401)
        .json({ msg: "Can't create a class if not a teacher" });
    }

    // create classroom object
    const classRoom = new ClassRoom({
      supervisor_ids: [user.id],
      name,
      description,
    });
    // save to database

    try {
      await classRoom.save();
      res.json({ classRoom });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route   GET /api/classroom/:id/meetings
// @desc    get all meetings of the current class
// @access  Private
router.get('/:id/meetings', async (req, res) => {
  try {
    const classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }
    res.json({ meetings: classroom.meetings });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route PUT /api/classroom/:id/posts
// @desc create a new post in classroom
// @access TODO Private to class member
router.put(
  '/:id/meetings',
  [
    body('topic', 'Please enter meeting topic').exists(),
    body('start_time', 'Please enter a valid time').exists(),
    body('duration', 'Please enter a valid duration').isNumeric(),
    body('password', 'Please enter password with 6 characters').isLength(6),
  ],
  async (req, res) => {
    try {
      const classRoom = await ClassRoom.findById(req.params.id);
      if (!classRoom) {
        return res.status(404).json({ msg: 'Classroom not found' });
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
        timezone: 'Asia/Saigon',
        duration,
        topic,
        type: 2,
        password,
      };

      const AccessToken = await zoomApi.generateToken();
      const apiUrl = 'https://api.zoom.us/v2/users/me/meetings';
      const options = {
        headers: {
          'Content-Type': 'application/json',
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
            res.status(500).json({ msg: 'Server error' });
          }
        })
        .catch((error) => {
          console.error(error.message);
          res.send('Error when sending request to Zoom Cloud');
        });
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Classroom not found' });
      }
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route /api/classroom/:id/members
// @body { member_id: id }
// @desc  add members to class
// @access
router.put(
  '/:id/members',
  auth,
  body('member_id', 'Member id is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // check if class exists
      const classroom = await ClassRoom.findById(req.params.id);
      if (!classroom) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Classroom not found' }] });
      }

      // check if this user is teacher and is the supervisor of the current class rooom
      if (
        !req.user.role === ROLE_TEACHER ||
        !classroom.supervisor_ids.includes(req.user.id)
      ) {
        console.log({ role: req.user.role });
        console.log({
          supervised: classroom.supervisor_ids.includes(req.user.id),
        });
        return res.status(401).json({ msg: 'Unauthorized' });
      }

      // check if this member exists
      const member_id = req.body.member_id;
      const member = await User.findById(member_id);
      if (!member) {
        return res.status(400).json({ errors: [{ msg: 'Member not found' }] });
      }

      // unshift to array
      classroom.member_ids.push(member_id);
      // save
      classroom.save();
      res.json({ classroom });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        res.status(400).json({ errors: [{ msg: 'Object not found' }] });
      }
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// POST
// @route   POST /api/classroom/:id/posts
// @desc    add post to a classroom
// @access  Private: admin, supervisors, members
router.put(
  '/:id/posts',
  auth,
  body('text', 'Post content is required').exists(),
  async (req, res) => {
    // validate post
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // get class
    try {
      const classroom = await ClassRoom.findById(req.params.id);
      if (!classroom) {
        return res.status(404).json({ errors: [{ msg: 'Class not found' }] });
      }

      // check access permission
      const user = req.user;
      if (
        !user.role === ROLE_ADMIN &&
        !classroom.supervisor_ids.includes(user.id) &&
        !classroom.member_ids.includes(user.id)
      ) {
        return res.status(401).json({ msg: 'Access denied' });
      }

      // add posts
      const post = {
        user: user.id,
        text: req.body.text,
      };

      classroom.posts.push(post);
      classroom.save();
      // return post
      res.json({ post });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ errors: [{ msg: 'Class not found' }] });
      }
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
