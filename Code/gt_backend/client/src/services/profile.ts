import axios from 'axios';

// authentication required
export const fetchProfile = async () => {
  const url = 'http://localhost:3001/api/profile';

  return axios.get(url);
};
