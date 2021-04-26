import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

  useEffect(() => {
    setClassDetail(dummyClasses[params.id]);
    // fetch a class
    // set state
  }, []);
  return (
    <Fragment>
      <h1>{classDetail.name}</h1>
      <div>
        <p>Description: {classDetail.description}</p>
      </div>
    </Fragment>
  );
};

export default ClassDetail;
