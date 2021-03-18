const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meeting_controller');

router.get('/', meetingController.index);
router.get('/create', meetingController.create);

module.exports = router;