// send request using axios
// console log the response
// need convert the string of client id and client secret into base64 before sending as authorization

const axios = require('axios');

const getAccessToken = async () => {
  const url = '...';
  const authString = 'pjqdk2rYRYC13CVvVXT7ag:H5Ek2lKZSDroxSbmYMFHeODPcmygrzQa';
  const authEncoded = btoa(authString);

  const config = {
    headers: {
      Authorization: `Basic ${authEncoded}`,
    },
  };

  const payload = {};

  try {
    const res = await axios.post(url, payload, config);
    console.log(res);
  } catch (err) {
    console.error(err.message);
  }
};
