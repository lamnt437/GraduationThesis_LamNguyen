const imagemin = require('imagemin');
// import imagemin from 'imagemin';
const mozjpeg = require('imagemin-mozjpeg');
// import mozjpeg from 'imagemin-mozjpeg';

const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();
const sharp = require('sharp');
const isJpg = require('is-jpg');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// create AWS instance
const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

const convertToJpg = async (input) => {
  if (isJpg(input)) {
    return input;
  }

  return sharp(input).jpeg().toBuffer();
};

const uploadFile = async (file) => {
  // const fileStream = fs.createReadStream(file.path);

  const miniFile = await imagemin([file.path], {
    destination: 'public/images',
    plugins: [convertToJpg, mozjpeg({ quality: 85 })],
  });

  const uploadParams = {
    Bucket: bucketName,
    Body: miniFile[0].data,
    Key: file.filename,
  };

  try {
    const res = s3.upload(uploadParams).promise();
    return res;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  // TODO handle error
  //   var getObject = null;

  //   try {
  //     getObject = s3.getObject(downloadParams);
  //     // console.log(getObject?.response?.httpResponse?.statusCode);
  //     if (typeof getObject?.response?.httpResponse?.statusCode === 'undefined') {
  //       console.log('Object not found!');
  //       return 'err';
  //     } else {
  //       console.log('found');
  //       return getObject.createReadStream();
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return 'err';
  //   }

  try {
    const s3Object = s3.getObject(downloadParams);
    return s3Object.createReadStream();
  } catch (error) {
    console.error(error.message);
    return error;
  }
};

module.exports.uploadFile = uploadFile;
module.exports.getFileStream = getFileStream;
