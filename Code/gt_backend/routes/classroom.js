const express = require('express');
const router = express.Router();
const multer = require('multer');
const config = require('config');
const s3 = require('../config/s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const {
  CLASS_POST_TYPE_NORMAL,
  CLASS_POST_TYPE_MEETING,
} = require('../config/constants');
const { ERROR_NO_OAUTH } = require('../config/errorCodes');

// multer file upload
const DIR = 'public/images';
const DOC_DIR = 'public/docs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
});

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error('Chỉ chấp nhận đăng ảnh có định dạng only png, jpg, jpeg!')
      );
    }
  },
}).single('image');

const docStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, DOC_DIR);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.replace(/\s/g, '_'));
  },
});

const uploadDoc = multer({ storage: docStorage });

// models
const ClassRoom = require('../models/ClassRoom');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Post = require('../models/Post');
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

router.get('/find', async (req, res) => {
  // find class
  const findId = req.query.id;

  // parseinto mongodb objectid
  if (!mongoose.isValidObjectId(findId)) {
    return res.status(404).json({ msg: 'Class not found' });
  }

  try {
    const foundClass = await ClassRoom.findOne(
      { _id: findId },
      { _id: 1, name: 1, description: 1 }
    );
    if (!foundClass) {
      return res.status(404).json({ msg: 'Class not found' });
    }

    return res.json({ classroom: foundClass });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Class not found' });
    }
    console.log(err);
    return res.status(500).json({ msg: 'Server error' });
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
    const classroom = new ClassRoom({
      supervisor_ids: [user.id],
      name,
      description,
    });
    // save to database
    console.log({ classroom });

    try {
      await classroom.save();
      res.json({ classroom });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

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
    // validate classroom
    var classroom;

    try {
      classroom = await ClassRoom.findById(req.params.id);
      if (!classroom) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Classroom not found' }] });
      }
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Classroom not found' }] });
      }
      console.log(err);
      return res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }

    console.log({ classroom });

    // check request is from supervisor
    const user = req.user;
    if (!isSupervisor(classroom, user)) {
      return res.status(403).json({
        errors: [
          {
            msg: 'Chỉ giáo viên mới có quyền thêm meeting!',
          },
        ],
      });
    }

    // validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // normal or recurrence meeting
    const { topic, description, duration, password } = req.body;
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
      res
        .status(400)
        .json({ errors: [{ msg: 'Thời gian bắt đầu không hợp lệ!' }] });
    }

    // get Zoom access token
    const profile = await User.findById(req.user.id);
    var accessToken = profile.access_token;
    if (!accessToken) {
      return res.status(403).json({
        errors: [
          {
            msg: 'Tài khoản chưa được kết nối với Zoom, xin vui lòng truy cập Hồ sơ cá nhân và nhấn kết nối',
            error_code: ERROR_NO_OAUTH,
          },
        ],
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
        return res.status(403).json({
          errors: [
            {
              msg: 'Có lỗi xảy ra khi kết nối với Zoom, làm ơn truy cập Hồ sơ và thực hiện kết nối lại!',
            },
          ],
        });
      }
    }

    // request new meeting
    var meeting;
    try {
      const zoomRes = await zoomService.createMeeting(
        topic,
        description,
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
      return res.status(401).json({
        errors: [
          {
            msg: 'Có lỗi xảy ra khi kết nối với Zoom, làm ơn truy cập Hồ sơ và thực hiện kết nối lại!',
          },
        ],
      });
    }

    // save new meeting
    try {
      meeting.save();
      classroom.meeting_ids.push(meeting._id);
      classroom.save();
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ errors: [{ msg: 'Error while saving meeting' }] });
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
    const member_ids = classroom.member_ids;

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
router.put('/:id/posts', auth, async (req, res) => {
  uploadImage(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error(err.message);
      return res.status(500).json({ err: err.message });
    } else if (err) {
      console.log(err.message);
      return res.status(400).json({ statusText: err.message });
    }

    let textFlag = false;
    let imgFlag = false;

    // validate text input
    const reqBody = JSON.parse(JSON.stringify(req.body));
    if (reqBody.hasOwnProperty('text')) {
      if (reqBody.text.trim().length !== 0) {
        // return res.status(400).json({ statusText: 'Text is required' });
        textFlag = true;
      }
    }

    if (req.file) {
      imgFlag = true;
    }

    if (!textFlag && !imgFlag) {
      console.log('nope');
      return res
        .status(400)
        .json({ statusText: 'Bài đăng cần có nội dung hoặc ảnh!' });
    }

    // get class
    let classroom = null;
    try {
      classroom = await ClassRoom.findById(req.params.id);
      if (!classroom) {
        return res.status(404).json({ errors: [{ msg: 'Class not found' }] });
      }
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ errors: [{ msg: 'Class not found' }] });
      }
      console.log(err);
      return res.status(500).json({ msg: 'Server error' });
    }

    // check access permission
    const user = req.user;
    if (!isRelated(classroom, user)) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // get user info
    var userInfo;
    try {
      userInfo = await User.findById(user.id);
    } catch (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ statusText: 'Error when retrieving user info' });
    }

    try {
      const image = req.file;
      const text = req.body.text.trim();

      var post;
      if (req.body.type == CLASS_POST_TYPE_MEETING) {
        const { zoom_id, password, topic, start_url, start_time, classroom } =
          req.body;
        const meeting = {
          zoom_id,
          password,
          topic,
          start_url,
          start_time,
          classroom,
        };
        post = new Post({
          user: user.id,
          text,
          image: req.file?.filename,
          type: CLASS_POST_TYPE_MEETING,
          meeting,
        });
      } else {
        post = new Post({
          user: user.id,
          text,
          image: req.file?.filename,
          type: CLASS_POST_TYPE_NORMAL,
        });
      }

      if (req.file) {
        try {
          const response = await s3.uploadFile(image);
          await unlinkFile(image.path);
        } catch (err) {
          console.log(err);
          return res.status(500).json({ msg: 'Error while uploading file' });
        }
      }

      post.save();

      classroom.posts.push(post._id);
      classroom.save();

      res.json({
        post: {
          ...post._doc,
          username: userInfo.name,
          avatar: userInfo.avatar,
        },
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  });
});

// @route   GET /api/classroom/:id/posts
// @desc    fetch class posts
// @access  Private related
router.get('/:id/posts', auth, async (req, res) => {
  // get class
  let classroom = null;
  try {
    classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ errors: [{ msg: 'Class not found' }] });
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Class not found' }] });
    }
    console.log(err);
    return res.status(500).json({ msg: 'Server error' });
  }

  // check permission
  const user = req.user;
  if (!isRelated(classroom, user)) {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  // get query
  const page = req.query.page;
  const limit = req.query.limit;

  // get posts
  const post_ids = classroom.posts;
  try {
    var posts = await Post.find({ _id: { $in: post_ids } }).sort({
      created_at: -1,
    });

    // solve await in loop
    if (Array.isArray(posts)) {
      const postPromises = posts.map(async (post) => {
        let owner = await User.findById(post.user);

        const fullPost = {
          ...post._doc,
          username: owner.name,
          avatar: owner.avatar,
        };

        return fullPost;
      });

      posts = await Promise.all(postPromises);
    }

    res.json({ posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

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
  const classId = req.params.id;
  if (!mongoose.isValidObjectId(classId)) {
    return res.status(404).json({ msg: 'Classroom not found' });
  }

  var classroom = null;

  try {
    // find class
    classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ msg: 'Class not found' });
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Classroom not found' }] });
    }
  }

  // check if user is supervisor
  const user = req.user;
  if (!isSupervisorOrAdmin(classroom, user)) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // list request
  // TODO fetch request profile info name email id /link to public profile
  var requests = classroom.requests;

  try {
    if (Array.isArray(requests)) {
      // fetch request info using await loop
      const requestPromises = requests.map(async (request) => {
        const requester = await User.findOne(
          { _id: request },
          { _id: 1, name: 1, email: 1 }
        );

        const fullRequest = {
          _id: request,
          username: requester.name,
          email: requester.email,
        };
        return fullRequest;
      });

      requests = await Promise.all(requestPromises);
      res.json({ requests });
    } else {
      res.json({ requests: [] });
    }
  } catch (error) {
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

// @route   GET /api/classroom/:id/docs
// @desc    GET documents from classroom
// @access  private related
router.get('/:id/docs', auth, async (req, res) => {
  // validation
  const classId = req.params.id;
  if (!mongoose.isValidObjectId(classId)) {
    return res.status(404).json({ statusText: 'Classroom not found' });
  }

  var classroom = null;

  try {
    // find class
    classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ statusText: 'Class not found' });
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ statusText: 'Classroom not found' });
    }
  }

  // check if user is supervisor
  const user = req.user;
  if (!isRelated(classroom, user)) {
    return res.status(403).json({ statusText: 'Unauthorized' });
  }

  return res.json({ docs: classroom.docs });
});

// @route   PUT /api/classroom/:id/docs
// @desc    upload document to classroom
// @access  private related
router.put('/:id/docs', auth, uploadDoc.single('doc'), async (req, res) => {
  // validation
  const classId = req.params.id;
  if (!mongoose.isValidObjectId(classId)) {
    return res.status(404).json({ statusText: 'Classroom not found' });
  }

  var classroom = null;

  try {
    // find class
    classroom = await ClassRoom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ statusText: 'Class not found' });
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ statusText: 'Classroom not found' });
    }
  }

  // check if user is supervisor
  const user = req.user;
  if (!isSupervisorOrAdmin(classroom, user)) {
    return res.status(401).json({ statusText: 'Unauthorized' });
  }

  const file = req.file;
  console.log({ file });
  // get file_dir from classroom
  // if not exist then generate one and save to db
  // no save it directly using classId
  try {
    const response = await s3.uploadDoc(file, classId);
    await unlinkFile(file.path);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ statusText: 'Error while uploading file' });
  }

  try {
    const filename = file.filename.replace(/\s/g, '_');
    const fileInfo = {
      _id: mongoose.Types.ObjectId(),
      filename,
      link: `${config.get('cloudfront')}/${classId}/${filename}`,
      created_at: Date.now(),
      uploader: user.id,
    };

    if (Array.isArray(classroom.docs)) {
      classroom.docs.unshift(fileInfo);
      console.log('has docs');
    } else {
      classroom.docs = [fileInfo];
      console.log('not docs');
    }

    console.log({ classroom });

    classroom.save();
    return res.json({
      doc: fileInfo,
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ statusText: 'Error while saving file info into database' });
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
