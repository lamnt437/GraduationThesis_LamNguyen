import React, { Fragment, useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { fetchClassroom } from '../services/classroom';
// import ClassDetailComponent from '../components/classroom/ClassDetail';
import classes from './css/ClassDetail.module.css';
import Header from '../components/classroom/header/Header';
import Sidebar from '../components/classroom/sidebar/Sidebar';
import Feed from '../components/classroom/tabs/feed/Feed';
import Widget from '../components/classroom/widget/Widget';

const ClassDetail = (props) => {
  const params = useParams();

  const [classDetail, setClassDetail] = useState({});

  useEffect(async () => {
    // TODO validate res isRelated here
    try {
      const res = await fetchClassroom(params.id);
      console.log(res);
    } catch (error) {
      console.error(error.message);
      console.log(error.response);
      if (error.response.status === 401) {
        // redirect to ClassRequest
        console.log('redirect to classrequest');
      }
    }

    // setClassDetail(res.data.classroom);
    // fetch a class
    // set state
  }, []);
  return (
    <Fragment>
      {/* <ClassDetailComponent
        name={classDetail.name}
        description={classDetail.description}
        classId={classDetail._id}
      /> */}
    </Fragment>
  );
};

export default ClassDetail;
