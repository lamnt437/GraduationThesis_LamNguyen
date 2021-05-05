import React, { Fragment } from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import classes from './css/ClassDetail.module.css';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Feed from './tabs/feed/Feed';
import Widget from './widget/Widget';
import MeetingList from './tabs/meeting/MeetingList';

export const ClassDetail = (props) => {
  const match = useRouteMatch();
  console.log(match);
  return (
    <Fragment>
      <Header />

      <div className={classes.app__body}>
        <Sidebar />
        {/* TODO design sub-route for classroom */}
        <Route path={`${match.path}/meetings`}>
          <MeetingList classId={props.classId} />
        </Route>
        {/* check path to  show meeting list instead of feed */}
        {/* feed load class detail from redux instead of passing params */}
        {/* use hook from react to see from which url this component is render */}
        <Route path={`${match.path}`} exact>
          <Feed
            name={props.name}
            description={props.description}
            classId={props.classId}
            posts={props.posts}
          />
        </Route>

        {/* <MeetingList /> */}
        <Widget />
      </div>
    </Fragment>
  );
};

export default ClassDetail;
