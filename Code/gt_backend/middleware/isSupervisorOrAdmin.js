const User = require('../models/User');
const ClassRoom = require('../models/ClassRoom');
const mongoose = require('mongoose');
const {
  ROLE_STUDENT,
  ROLE_TEACHER,
  ROLE_ADMIN,
} = require('../config/constants');

// @module  Auth
// @desc    Authenticate user
module.exports = async (req, res, next) => {
  // get token from header
  const userId = mongoose.Types.ObjectId(req.user.id);
  const classId = mongoose.Types.ObjectId(req.params.classId);

  var user;
  var classroom;
  try {
    classroom = await ClassRoom.findById(classId);
  } catch (err) {
    return res.status(404).json({ statusText: 'Classroom not found' });
  }

  try {
    user = await User.findById(userId);
  } catch (err) {
    return res.status(404).json({ statusText: 'User not found' });
  }

  if (user.role === ROLE_STUDENT)
    return res.status(403).json({ statusText: 'Unauthorized' });

  if (user.role === ROLE_TEACHER && classroom.supervisor_ids.includes(userId)) {
    req.username = user.name;
    req.classname = classroom.name;
    return next();
  }

  req.username = user.name;
  req.classname = classroom.name;
  if (user.role === ROLE_ADMIN) return next();

  return res.status(403).json({ statusText: 'Unauthorized' });
};
