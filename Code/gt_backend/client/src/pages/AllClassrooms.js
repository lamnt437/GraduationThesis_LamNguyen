import React, { Fragment, useState, useEffect } from 'react';
import { fetchClassRooms } from '../services/classroom';
import ClassList from '../components/classroom/ClassList';

const AllClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);

  /* Dummy data */
  const classroomArray = [
    {
      _id: 'abc',
      name: 'First Class',
      description: 'Class for Elite student',
    },

    {
      _id: 'abc',
      name: 'Second Class',
      description: 'Class for almost Elite student',
    },
  ];

  useEffect(async () => {
    try {
      const res = await fetchClassRooms();
      console.log(res.data);
      setClassrooms(res.data.classrooms);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  return (
    <Fragment>
      <h1>Tất cả các lớp</h1>
      {/* <div>{classrooms}</div> */}
      <ClassList classrooms={classrooms} />
    </Fragment>
  );
};

export default AllClassrooms;
