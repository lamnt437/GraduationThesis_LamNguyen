import axios from 'axios';

const url = 'http://localhost:3001/api/classroom';

export const fetchClassRooms = async () => {
  try {
    const classrooms = await axios.get(url);
    return classrooms;
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchClassroom = async (id: String) => {
  const res = await axios.get(url + `/${id}`);
  return res;
};

export const fetchMembers = async (id: String) => {
  const res = await axios.get(url + `/${id}/members`);

  return res;
};

export const fetchSupervisors = async (id: String) => {
  const res = await axios.get(url + `/${id}/supervisors`);

  return res;
};

export const fetchPosts = async (id: String) => {
  const res = await axios.get(url + `/${id}/posts`);

  return res;
};

export const addPost = async (text: String, classId: String) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postContent = {
    text,
  };

  // TODO validate input
  const url = `http://localhost:3001/api/classroom/${classId}/posts`;
  const body = JSON.stringify(postContent);

  const response = await axios.put(url, body, config);

  return response;
};

export const addMeeting = async (
  classId: String,
  topic: String,
  description: String,
  start_time: Date,
  duration: Number,
  password: String,
  type: Number,
  recurrence: any
) => {
  const url = `http://localhost:3001/api/classroom/${classId}/meetings`;

  const meeting = {
    topic,
    description,
    start_time,
    duration,
    password,
    type,
    recurrence,
  };

  const body = JSON.stringify(meeting);
  console.log(body);

  const reqConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.put(url, body, reqConfig);
  return response;
};
