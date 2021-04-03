const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const ClassRoom = require("../models/ClassRoom");

// router.get("/", (req, res) => {});

// @route POST /api/classroom
// @desc create a new classroom
// @access Private to teacher
router.post(
  "/",
  body("name", "Name should not be empty").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    // create classroom object
    const classRoom = new ClassRoom({
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

module.exports = router;
