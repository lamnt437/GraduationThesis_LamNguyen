const AWS = require('aws-sdk');
const config = require('config');
const fs = require('fs');
require('dotenv').config();

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

const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
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
