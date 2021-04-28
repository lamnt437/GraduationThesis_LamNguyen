import React, { Fragment } from 'react';
import classes from './css/ClassDetail.module.css';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Feed from './feed/Feed';
import Widget from './widget/Widget';

export const ClassDetail = (props) => {
  return (
    <Fragment>
      <Header />

      <div className={classes.app__body}>
        <Sidebar />
        <Feed
          name={props.name}
          description={props.description}
          classId={props.classId}
        />
        <Widget />
      </div>
    </Fragment>
  );
};

export default ClassDetail;
