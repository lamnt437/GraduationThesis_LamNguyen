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
  try {
    const classroom = await axios.get(url + `/${id}`);
    // console.log(classroom);
    return classroom;
  } catch (err) {
    console.error(err.message);
  }
};
