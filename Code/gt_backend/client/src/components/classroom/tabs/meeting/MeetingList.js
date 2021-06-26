import React, { Fragment, useEffect, useState } from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import MeetingItem from './MeetingItem';
import MeetingScheduler from './MeetingScheduler';
import Loading from '../../../layout/Loading';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchMeetingFromClassroom } from '../../../../services/meeting.ts';
import { ROLE_TEACHER } from '../../../../constants/constants';
import '../Tab.css';

const MeetingList = ({ classId, user, loggedUser }) => {
  const [meetingList, setMeetingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const history = useHistory();
  const match = useRouteMatch();

  const onCreateHandler = (e) => {
    e.preventDefault();
    history.push(`${match.url}/create`);
  };

  useEffect(async () => {
    try {
      const response = await fetchMeetingFromClassroom(classId);
      console.log({ response });
      if (response.data) {
        console.log('set');
        setMeetingList(response.data.meetings);
      }
      console.log({ meetingList });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setHasError(true);
      setIsLoading(false);
    }
  }, []);

  let renderedComp = <Loading />;

  if (!isLoading) {
    if (hasError) {
      renderedComp = <div>Can't load meeting</div>;
    } else {
      renderedComp = (
        <div className='tab'>
          <Route path={match.path} exact>
            <div>
              {loggedUser.role == ROLE_TEACHER ? (
                <button onClick={(e) => onCreateHandler(e)}>
                  Tạo meeting mới
                </button>
              ) : (
                ''
              )}

              {Array.isArray(meetingList) &&
                meetingList.map((meeting) => (
                  <MeetingItem
                    meeting={meeting}
                    key={meeting._id}
                    user={user}
                  />
                ))}
            </div>
          </Route>

          <Route path={`${match.path}/create`}>
            {/* TODO display create meeting form */}
            <MeetingScheduler classId={classId} />
          </Route>
        </div>
      );
    }
  }

  return renderedComp;
};

MeetingItem.propTypes = {
  loggedUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  loggedUser: state.auth.user,
});

export default connect(mapStateToProps)(MeetingList);
