import axios from 'axios';

// authentication required
export const fetchMyProfile = async () => {
  const url = '/api/profile';

  return axios.get(url);
};
