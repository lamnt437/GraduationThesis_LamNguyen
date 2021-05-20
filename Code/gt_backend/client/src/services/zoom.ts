import axios from 'axios';

// send code to server to get token from zoom
// save code to user profile
export const zoomfunc = async (code: String) => {
  const url = '/api/profile/zoom';

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    code: code,
  });

  const response = await axios.put(url, body, config);

  return response;
};
