import axios from 'axios';

export const fetchMeetingFromClassroom = async (classId: String) => {
  const url = `http://localhost:3001/api/classroom/${classId}/meetings`;

  const response = await axios.get(url);

  return response;
};

export const fetchMeeting = async () => {
  const url = `http://localhost:3001/api/meeting/`;

  const response = await axios.get(url);

  return response;
};
