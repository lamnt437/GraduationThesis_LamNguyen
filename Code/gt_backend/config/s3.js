const AWS = require('aws-sdk');
const config = require('config');
const fs = require('fs');

// create AWS instance
const s3 = new AWS.S3({
  accessKeyId: config.get('awsAccessKey'),
  secretAccessKey: config.get('awsSecretKey'),
  region: config.get('awsRegion'),
});

const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: config.get('awsBucketName'),
    Body: fileStream,
    Key: file.filename,
  };

  const res = s3.upload(uploadParams).promise();
  return res;
};

const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: config.get('awsBucketName'),
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
  return s3.getObject(downloadParams).createReadStream();
};

module.exports.uploadFile = uploadFile;
module.exports.getFileStream = getFileStream;
