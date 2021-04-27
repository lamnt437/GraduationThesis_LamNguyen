import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClassroom } from '../services/classroom';
import ClassDetailComponent from '../components/classroom/ClassDetail';

const ClassDetail = (props) => {
  const params = useParams();

  const [classDetail, setClassDetail] = useState({});

  const dummyClasses = [
    {
      _id: 'abc',
      name: 'Dummy class',
      description: 'Class for dummies',
      posts: [],
    },

    {
      _id: 'def',
      name: 'def class',
      description: 'Class for def',
      posts: [],
    },

    {
      _id: 'ghi',
      name: 'ghi class',
      description: 'Class for ghi',
      posts: [],
    },
  ];

  useEffect(async () => {
    const res = await fetchClassroom(params.id);
    console.log(res);
    setClassDetail(res.data.classroom);
    // fetch a class
    // set state
  }, []);
  return (
    <Fragment>
      <ClassDetailComponent
        name={classDetail.name}
        description={classDetail.description}
      />
    </Fragment>
  );
};

export default ClassDetail;
