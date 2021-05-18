import axios from 'axios';

export const fetchMeetingFromClassroom = async (classId: String) => {
  const url = `/api/classroom/${classId}/meetings`;

  const response = await axios.get(url);

  return response;
};

export const fetchMeeting = async () => {
  const url = '/api/meeting/';

  const response = await axios.get(url);

  return response;
};
