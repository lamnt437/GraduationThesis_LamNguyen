const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.get('/isExpired/:token', (req, res) => {
  try {
    const decoded = jwt.decode(req.params.token);
    const exp = decoded.exp;
    if (Date.now() >= exp * 1000) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (err) {
    return res.send(true);
  }
});

module.exports = router;
