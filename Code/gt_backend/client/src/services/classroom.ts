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
