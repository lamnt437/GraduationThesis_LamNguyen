import React, { Fragment } from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import classes from './css/ClassDetail.module.css';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Feed from './tabs/feed/Feed';
import Widget from './widget/Widget';
import MeetingList from './tabs/meeting/MeetingList';
import MemberList from './tabs/member/MemberList';
import ClassCalendar from './tabs/calendar/ClassCalendar.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const ClassDetail = (props) => {
  const match = useRouteMatch();
  console.log(match);
  return (
    <Fragment>
      <Header username={props.user?.name} />

      <div className={classes.app__body}>
        <Sidebar username={props.user?.name} avatar={props.user?.avatar} />
        {/* TODO design sub-route for classroom */}
        <Route path={`${match.path}/meetings`}>
          <MeetingList
            className={classes.center__comp}
            classId={props.classId}
          />
        </Route>
        {/* check path to  show meeting list instead of feed */}
        {/* feed load class detail from redux instead of passing params */}
        {/* use hook from react to see from which url this component is render */}
        <Route path={[`${match.path}`, `${match.path}/home`]} exact>
          <Feed
            name={props.name}
            description={props.description}
            classId={props.classId}
            posts={props.posts}
            // className={classes.center__comp}
          />
        </Route>

        <Route path={`${match.path}/members`} exact>
          <MemberList
            classId={props.classId}
            className={classes.center__comp}
          />
        </Route>

        <Route path={`${match.path}/members`} exact>
          <MemberList
            classId={props.classId}
            className={classes.center__comp}
          />
        </Route>

        <Route path={`${match.path}/calendar`}>
          <ClassCalendar
            className={classes.center__comp}
            classId={props.classId}
          />
        </Route>
        <Widget />
      </div>
    </Fragment>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ClassDetail);
