const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/images' });
const s3 = require('../config/s3');

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

router.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file;
  const result = await s3.uploadFile(file);
  console.log(result);
  res.send('okay');
});

router.get('/images/:key', (req, res) => {
  const key = req.params.key;

  console.log({ key });

  try {
    const readStream = s3.getFileStream(key);
    // TODO pipe an empty image
    if (readStream === 'err') {
      return res.json('hello');
    }
    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.json({ msg: 'error' });
  }
});

module.exports = router;
