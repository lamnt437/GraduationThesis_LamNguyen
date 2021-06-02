const zoomApi = require('./zoomapi');
const axios = require('axios');
const dateFormat = require('dateformat');
const config = require('config');
const jwt = require('jsonwebtoken');

async function createMeeting(
  topic,
  description,
  start_time,
  duration,
  password,
  type,
  recurrence,
  AccessToken
) {
  let payload = {
    description,
    duration,
    start_time,
    timezone: 'Asia/Saigon',
    duration,
    topic,
    type,
    password,
  };

  if (type == 8) {
    payload.recurrence = recurrence;
  }

  console.log({ payload });

  const body = JSON.stringify(payload);
  // token passed from caller

  const apiUrl = 'https://api.zoom.us/v2/users/me/meetings';
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AccessToken}`,
    },
  };

  console.log({ options });

  const zoomRes = await axios.post(apiUrl, body, options);
  return zoomRes;

  // axios
  //   .post(apiUrl, body, options)
  //   .then(async (response) => {
  //     const savedId = response.data.id;
  //     const savedStartTime = response.data.start_time;
  //     const savedPassword = response.data.password;

  //     const newMeeting = new Meeting({
  //       meeting_id: savedId,
  //       start_time: savedStartTime,
  //       password: savedPassword,
  //       duration,
  //       topic,
  //     });

  //     try {
  //       // save meeting info to database
  //       await newMeeting.save();
  //       const exactTime = dateFormat(
  //         newMeeting.start_time,
  //         "yyyy-mm-dd'T'HH:MM:ssZ"
  //       );

  //       return {
  //         meeting: {
  //           db_id: newMeeting.id,
  //           data: response.data,
  //         },
  //         errors: {},
  //       };
  //     } catch (err) {
  //       console.error(err.message);

  //       // res.status(500).json({ msg: 'Server error' });
  //       return {
  //         meeting: {},
  //         errors: {
  //           msg: 'Server error',
  //         },
  //       };
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return {
  //       meeting: {},
  //       errors: {
  //         msg: 'Error when sending request to ZoomApi',
  //       },
  //     };
  //   });
}

const getAccessToken = async (code) => {
  // create authString
  const clientId = config.get('zoomClientId');
  const clientSecret = config.get('zoomClientSecret');
  const decodedString = `${clientId}:${clientSecret}`;
  // const authString = btoa(decodedString);
  const authString = Buffer.from(decodedString).toString('base64');
  // console.log({ authString });
  // const url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/profile`;
  const url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=https://zoomclass2021.herokuapp.com/profile`;
  const reqConfig = {
    headers: {
      Authorization: `Basic ${authString}`,
    },
  };

  // to zoom server to get token and refresh token
  const zoomRes = await axios.post(url, {}, reqConfig);
  return zoomRes;
};

const refreshAccessToken = async (refreshToken) => {
  const grant_type = 'refresh_token';

  const url = `https://zoom.us/oauth/token?grant_type=${grant_type}&refresh_token=${refreshToken}`;

  // header config
  const clientId = config.get('zoomClientId');
  const clientSecret = config.get('zoomClientSecret');
  const decodedString = `${clientId}:${clientSecret}`;
  const authString = Buffer.from(decodedString).toString('base64');
  const reqConfig = {
    headers: {
      Authorization: `Basic ${authString}`,
    },
  };

  const zoomRes = await axios.post(url, {}, reqConfig);

  return zoomRes;
};

const isValidToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    const exp = decoded.exp;
    if (Date.now() >= exp * 1000) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
};

module.exports.createMeeting = createMeeting;
module.exports.getAccessToken = getAccessToken;
module.exports.refreshAccessToken = refreshAccessToken;
module.exports.isValidToken = isValidToken;
