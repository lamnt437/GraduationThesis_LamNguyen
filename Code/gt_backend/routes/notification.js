const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const ClassRoom = require('../models/ClassRoom');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  // get all class followed
  const userId = req.user.id;
  const followedClasses = await ClassRoom.find(
    { member_ids: userId },
    { _id: 1 }
  );

  // get user
  const user = await User.findById(userId);

  // get user read pointer
  var readPointers = user.read_notifications;

  // get all notifications timeline
  const timelinePromises = followedClasses.map(async (classObj) => {
    let timeline = await Notification.find({ classroom: classObj._id });

    let prunedTimeline = {
      classId: classObj._id,
      notifications: timeline,
    };

    console.log({ readPointers });
    if (readPointers) {
      prunedTimeline = pruneTimeline(classObj._id, timeline, readPointers);
    }

    return prunedTimeline;
  });

  const timelines = await Promise.all(timelinePromises);

  // merge notification timeline
  var notificationTimeline = [];
  timelines.forEach((timeline) => {
    notificationTimeline = notificationTimeline.concat(timeline.notifications);
  });

  notificationTimeline.sort(function (a, b) {
    return b.created_at - a.created_at;
  });

  console.log({ notificationTimeline });
  res.json({ notificationTimeline });
});

const pruneTimeline = (classId, timeline, pointers) => {
  console.log({ classId });
  var class_id = classId;
  const returned_pointer = pointers.find((pointer) => {
    return pointer.class_id.toString() == class_id.toString();
  });

  //
  console.log({ returned_pointer });
  //

  if (!returned_pointer) {
    return {
      classId: classId,
      notifications: timeline,
    };
  }

  const latestNotiId = returned_pointer.notification_id;

  const latestNoti = timeline.find(
    (notification) => notification._id.toString() == latestNotiId.toString()
  );

  //
  console.log({ latestNoti });
  //

  const notices = timeline.filter(
    (notification) => notification.created_at > latestNoti.created_at
  );
  // array of
  // a collection of read pointer, taken from user account
  //

  return {
    classId: classId,
    notifications: notices,
  };
};

module.exports = router;
/* design flow for prunning */
/* why need to design? because multiple cases for users */
/* user can already have pointer or not */
/* if user don't have (pointers is null, then skip prunning) */
/* if user has pointer, then pass pointer collection into prunning fucntion*/
