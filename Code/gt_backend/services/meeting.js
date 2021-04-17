const zoomApi = require('./zoomapi');
const axios = require('axios');
const dateFormat = require('dateformat');

async function createMeeting(topic, start_time, duration, password) {
  let payload = {
    duration,
    start_time,
    timezone: 'Asia/Saigon',
    duration,
    topic,
    type: 2,
    password,
  };

  const AccessToken = await zoomApi.generateToken();
  const apiUrl = 'https://api.zoom.us/v2/users/me/meetings';
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AccessToken}`,
    },
  };

  axios
    .post(apiUrl, payload, options)
    .then(async (response) => {
      const savedId = response.data.id;
      const savedStartTime = response.data.start_time;
      const savedPassword = response.data.password;

      const newMeeting = new Meeting({
        meeting_id: savedId,
        start_time: savedStartTime,
        password: savedPassword,
        duration,
        topic,
      });

      try {
        // save meeting info to database
        await newMeeting.save();
        const exactTime = dateFormat(
          newMeeting.start_time,
          "yyyy-mm-dd'T'HH:MM:ssZ"
        );

        return {
          meeting: {
            db_id: newMeeting.id,
            data: response.data,
          },
          errors: {},
        };
      } catch (err) {
        console.error(err.message);
        // res.status(500).json({ msg: 'Server error' });
        return {
          meeting: {},
          errors: {
            msg: 'Server error',
          },
        };
      }
    })
    .catch((error) => {
      console.error(error.message);
      return {
        meeting: {},
        errors: {
          msg: 'Error when sending request to ZoomApi',
        },
      };
    });
}

module.exports.createMeeting = createMeeting;
