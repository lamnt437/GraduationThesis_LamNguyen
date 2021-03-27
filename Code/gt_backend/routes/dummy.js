const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  res.send("Hello");
});

module.exports = router;
