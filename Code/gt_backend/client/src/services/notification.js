import axios from 'axios';

const url = '/api/notification';

export const fetchNewNotifications = async () => {
  const response = await axios.get(url);

  return response;
};
