import { Fragment } from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import classes from './css/ClassDetail.module.css';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Feed from './tabs/feed/Feed';
import NotificationList from './widget/NotificationList';
import MeetingList from './tabs/meeting/MeetingList';
import MemberList from './tabs/member/MemberList';
import RequestList from './tabs/member/RequestList';
import DocumentList from './tabs/document/DocumentList';
import ClassCalendar from './tabs/calendar/ClassCalendar.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ROLE_TEACHER } from '../../constants/constants';
import FilterFeed from './tabs/feed/FilterFeed';

export const ClassDetail = (props) => {
  const match = useRouteMatch();
  return (
    <Fragment>
      <Header username={props.user?.name} />

      <div className={classes.app__body}>
        <Sidebar
          classroomName={props.name}
          avatar={props.user?.avatar}
          classId={props.classId}
        />

        <Route path={[`${match.path}`, `${match.path}/home`]} exact>
          <Feed
            description={props.description}
            classId={props.classId}
            className={classes.center__comp}
            classroomName={props.name}
          />
        </Route>

        <Route path={`${match.path}/calendar`}>
          <ClassCalendar
            className={classes.center__comp}
            classId={props.classId}
          />
        </Route>

        {/* <Route path={`${match.path}/tasks`} exact>
          <TaskList
            classId={props.classId}
            className={classes.center__comp}
          />
        </Route> */}

        <Route path={`${match.path}/meetings`}>
          <MeetingList
            className={classes.center__comp}
            classId={props.classId}
            user={props.user}
          />
        </Route>

        <Route path={`${match.path}/members`} exact>
          <div className={classes.tab__member}>
            <MemberList
              classId={props.classId}
              className={classes.memberList}
            />
            {props.user.role == ROLE_TEACHER ? (
              <RequestList
                classId={props.classId}
                className={classes.requestList}
              />
            ) : (
              ''
            )}
          </div>
        </Route>

        <Route path={`${match.path}/documents`} exact>
          <DocumentList
            classId={props.classId}
            className={classes.center__comp}
            docs={props.docs}
          />
        </Route>

        <Route path={`${match.path}/feed`}>
          <FilterFeed
            description={props.description}
            classId={props.classId}
            className={classes.center__comp}
            classroomName={props.name}
          />
        </Route>
        <NotificationList classId={props.classId} />
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
