const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
var multer = require('multer');
const s3 = require('../config/s3');

const DIR = 'public/images';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
});

const upload = multer({
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
      return cb(new Error('only png, jpg, jpeg format is allowed'));
    }
  },
}).single('image');

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

router.post('/images', (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error(err.message);
      return res.status(500).json({ err: err.message });
    } else if (err) {
      console.error(err.message);
      return res.status(400).json({ err: err.message });
    }

    let file = req.file;

    const result = await s3.uploadFile(file);
    console.log(result);
    res.send('okay');
  });
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
