const express = require('express');
const router = express.Router();

// models
const ClassRoom = require('../models/ClassRoom');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
// middlewares
const auth = require('../middleware/auth');
// utils
const { body, validationResult } = require('express-validator');
const dateFormat = require('dateformat');
const mongoose = require('mongoose');
const classroomDataAccess = require('../data_access/classroom');
const zoomService = require('../services/meetingOAuth');

const { ROLE_TEACHER, ROLE_ADMIN } = require('../config/constants');

// @route GET /api/classroom
// desc get all classes
// access Private
router.get('/', auth, async (req, res) => {
  // fetch only the overview
  // fetch only the onver view of the lcass
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

// @route GET /api/classroom/:id
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

    if (!isRelated(classroom, user)) {
      return res.status(401).json({ msg: 'Access denied' });
    }

    res.json({ classroom });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

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

// @route PUT /api/classroom/:id/posts
// @desc create a new post in classroom
// @access TODO Private to class member

// const { topic, start_time, password, duration, type } = req.body;
//   const time = dateFormat(start_time, "yyyy-mm-dd'T'HH:MM:ssZ");

//   let recurrence = {};
//   if (type == 8) {
//     recurrence = req.body.recurrence;
//   }

//   console.log({ recurrence });

//   // get token
//   // check if user connected to zoom service
//   console.log(req.user);
//   const profile = await User.findById(req.user.id);

//   var accessToken = profile.access_token;
//   if (!accessToken) {
//     return res.status(403).json({
//       msg: "Account hasn't connected to zoom service",
//       error_code: ERROR_NO_OAUTH,
//     });
//   }

//   // validate token
//   const isValid = zoomService.isValidToken(accessToken);

//   if (!isValid) {
//     try {
//       // need refresh
//       console.log('Refreshing.............................');
//       // get refresh token from profile
//       const refreshToken = profile.refresh_token;
//       console.log({ refreshToken });

//       // run refreshAccessToken service
//       const zoomRes = await zoomService.refreshAccessToken(refreshToken);
//       accessToken = zoomRes.data.access_token;

//       // save token to account
//       profile.access_token = accessToken;
//       profile.refresh_token = zoomRes.data.refresh_token;
//       profile.save();

//       console.log({ newAccessToken: accessToken });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ msg: 'Error while refresh access token' });
//     }
//   }

//   // send request
//   try {
//     const zoomRes = await zoomService.createMeeting(
//       topic,
//       time,
//       duration,
//       password,
//       type,
//       recurrence,
//       accessToken
//     );

//     let meeting = new Meeting({ ...zoomRes.data });
//     console.log({ zoomRes: zoomRes.data });
//     // meeting = { ...zoomRes.data };
//     meeting.zoom_id = zoomRes.data.id;
//     console.log({ meeting });
//     if (meeting.type == 8) {
//       meeting.duration = zoomRes.data.occurrences[0].duration;
//       meeting.start_time = zoomRes.data.occurrences[0].start_time;
//     }
//     meeting.creator = req.user.id;
//     meeting.save();
//     res.json({ meeting });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: 'Error when creating meeting' });
//   }

// route  PUT /api/classroom/:id/meetings
// desc   schedule a meeting in classroom
// access Private members
router.put(
  '/:id/meetings',
  auth,
  [
    body('topic', 'Please enter meeting topic').exists(),
    body('start_time', 'Please enter a valid time').exists(),
    body(
      'duration',
      'Please enter a valid duration in number of minutes'
    ).isNumeric(),
    body('password', 'Please enter password with 6 characters').isLength(6),
  ],
  async (req, res) => {
    // TODO check is supervisor
    // validate classroom
    var classroom;

    try {
      classroom = await ClassRoom.findById(req.params.id);
      if (!classroom) {
        return res.status(404).json({ msg: 'Classroom not found' });
      }
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Classroom not found' });
      }
      console.log(err);
      return res.status(500).json({ msg: 'Server error' });
    }

    console.log({ classroom });

    // check request is from supervisor
    const user = req.user;
    if (!isSupervisor(classroom, user)) {
      return res.status(403).json({
        msg: 'Unauthorized request. Only supervisor can schedule meetings',
      });
    }

    // validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // normal or recurrence meeting
    const { topic, duration, password } = req.body;
    let type = req.body.type;
    // default meeting type is 2 (normal)
    if (!type) {
      type = 2;
    }
    let recurrence = {};
    if (type == 8) {
      recurrence = req.body.recurrence;
    }

    var start_time;
    try {
      start_time = dateFormat(req.body.start_time, "yyyy-mm-dd'T'HH:MM:ssZ");
    } catch (err) {
      console.log(err);
      res.status(400).json({ errors: [{ msg: 'Invalid start_time' }] });
    }

    // get Zoom access token
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
        return res
          .status(500)
          .json({ msg: 'Error while refresh access token' });
      }
    }

    // request new meeting
    var meeting;
    try {
      const zoomRes = await zoomService.createMeeting(
        topic,
        start_time,
        duration,
        password,
        type,
        recurrence,
        accessToken
      );

      meeting = new Meeting({ ...zoomRes.data });
      console.log({ zoomRes: zoomRes.data });

      meeting.zoom_id = zoomRes.data.id;
      console.log({ meeting });
      if (meeting.type == 8) {
        meeting.duration = zoomRes.data.occurrences[0].duration;
        meeting.start_time = zoomRes.data.occurrences[0].start_time;
      }
      meeting.creator = req.user.id;
      meeting.classroom = classroom._id;
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Error when create meeting' });
    }

    // save new meeting
    try {
      meeting.save();
      classroom.meeting_ids.push(meeting._id);
      classroom.save();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Error when save new meeting' });
    }

    res.json({ meeting });
  }
);

// @route PUT /api/classroom/:id/members
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

// GET
// @route   GET /api/classroom/:id/members
// @access  ADMIN, supervisors, members
router.get('/:id/members', auth, async (req, res) => {
  // get class
  const classId = req.params.id;
  if (!mongoose.isValidObjectId(classId)) {
    return res.status(404).json({ msg: 'Classroom not found' });
  }

  const classroom = await ClassRoom.findById(classId);
  if (!classroom) {
    return res.status(404).json({ msg: 'Classroom not found' });
  }

  // check if user related
  if (!isRelated(classroom, req.user)) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // get member by look up
  try {
    // const classWithMembers = await ClassRoom.aggregate([
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'member_ids',
    //       foreignField: '_id',
    //       as: 'members',
    //     },
    //   },
    // ]).findById(req.params.id);
    // const members = classWithMembers.members;
    // console.log(members);
    // res.status.json({ members });
    const member_ids = classroom.member_ids;
    // console.log(member_ids);

    const members = await User.find(
      { _id: { $in: member_ids } },
      { password: 0 }
    );

    res.json({ members });
  } catch (err) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// route  GET /api/classroom/:id/supervisors
// desc   get all supervisors of a classroom
// access Private related
router.get('/:id/supervisors', auth, async (req, res) => {
  // get class
  const classroom = await ClassRoom.findById(req.params.id);
  if (!classroom) {
    return res.status(404).json({ msg: 'Classroom not found' });
  }

  // check if user related
  if (!isRelated(classroom, req.user)) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  try {
    const supervisor_ids = classroom.supervisor_ids;
    // console.log(supervisor_ids);

    const supervisors = await User.find(
      { _id: { $in: supervisor_ids } },
      { password: 0 }
    );

    res.json({ supervisors });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// route  GET /api/classroom/:id/meetings
// desc   get meetings from a classroom
// access Private related
router.get('/:id/meetings', auth, async (req, res) => {
  // get class
  const classroom = await ClassRoom.findById(req.params.id);
  if (!classroom) {
    return res.status(404).json({ msg: 'Classroom not found' });
  }

  // check if user related
  if (!isRelated(classroom, req.user)) {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  try {
    const meeting_ids = classroom.meeting_ids;

    const meetings = await Meeting.find({ _id: { $in: meeting_ids } });

    res.json({ meetings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST
// @route   PUT /api/classroom/:id/posts
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

// route    POST /api/classroom/:id/request
// desc     user add request to join class
// access   Private user
router.post('/:id/request', auth, async (req, res) => {
  try {
    // find class
    const classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ msg: 'Class not found' });
    }
    // check if user in class member/ super
    const user = req.user;
    if (isRelated(classroom, user)) {
      return res
        .status(400)
        .json({ msg: 'Invalid request. User can not join' });
    }

    // check if request sent
    if (Array.isArray(classroom.requests)) {
      if (classroom.requests.includes(user.id)) {
        return res.status(400).json({ msg: 'Request already sent' });
      }
    }
    // send request
    classroom.requests = [];
    classroom.requests.push(user.id);
    classroom.save();
    res.json({ msg: 'Request sent' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ errors: [{ msg: 'Classroom not found' }] });
    }
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// route  GET /api/classroom/:id/request
// desc   get requests to join in a classroom
// access Private supervisors or admins
router.get('/:id/request', auth, async (req, res) => {
  try {
    const classId = req.params.id;
    if (!mongoose.isValidObjectId(classId)) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }
    // find class
    const classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ msg: 'Class not found' });
    }

    // check if user is supervisor
    const user = req.user;
    if (!isSupervisorOrAdmin(classroom, user)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // list request
    const requests = classroom.requests;
    if (Array.isArray(requests)) {
      res.json({ requests });
    } else {
      res.json({ requests: [] });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ errors: [{ msg: 'Classroom not found' }] });
    }
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// route  PUT /api/classroom/:id/request/:reqId
// desc   approve request to join
// access Private supervisors
router.put('/:id/request/:reqId', auth, async (req, res) => {
  try {
    const classId = req.params.id;
    if (!mongoose.isValidObjectId(classId)) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }
    const reqId = req.params.reqId;
    if (!mongoose.isValidObjectId(reqId)) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // find class
    const classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ msg: 'Class not found' });
    }

    // check if user is supervisor
    const user = req.user;
    if (!isSupervisor(classroom, user)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // request exists?
    const requests = classroom.requests;
    if (Array.isArray(requests)) {
      if (requests.includes(reqId)) {
        // add member
        classroom.member_ids.push(reqId);
        // remove request
        removeElement(classroom.requests, reqId);
        classroom.save();
        console.log(classroom);
        return res.json({ msg: 'Request approved' });
      }
    }

    return res.status(400).json({ msg: 'Request not found' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ errors: [{ msg: 'Classroom not found' }] });
    }
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

const removeElement = (array, value) => {
  var index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
};

const isSupervisor = (classroom, user) => {
  if (!classroom.supervisor_ids.includes(user.id)) {
    return false;
  } else {
    return true;
  }
};

const isSupervisorOrAdmin = (classroom, user) => {
  if (user.role !== ROLE_ADMIN && !classroom.supervisor_ids.includes(user.id)) {
    return false;
  } else {
    return true;
  }
};

const isRelated = (classroom, user) => {
  if (
    user.role !== ROLE_ADMIN &&
    !classroom.supervisor_ids.includes(user.id) &&
    !classroom.member_ids.includes(user.id)
  ) {
    return false;
  } else {
    return true;
  }
};

module.exports = router;
// TODO handle route not found
