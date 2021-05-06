import axios from 'axios';

// authentication required
export const fetchMyProfile = async () => {
  const url = 'http://localhost:3001/api/profile';

  return axios.get(url);
};
