import axios from 'axios';

const url = 'http://localhost:3001/api/classroom';

export const fetchClassRoom = async () => {
  try {
    const classrooms = await axios.get(url);
    return classrooms;
  } catch (err) {
    console.log(err.message);
  }
};
