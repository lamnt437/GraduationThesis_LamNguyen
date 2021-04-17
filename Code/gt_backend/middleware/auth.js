const jwt = require('jsonwebtoken');
const config = require('config');

// @module  Auth
// @desc    Authenticate user
module.exports = (req, res, next) => {
  // get token from header
  const token = req.header('x-auth-token');

  // no token
  if (!token) {
    return res.status(401).json({ msg: 'No token. Authorization denied' });
  }

  // jwt verify
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token. Authorization denied' });
  }
};
