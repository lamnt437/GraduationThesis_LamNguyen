import React, { useState } from 'react';
import ZoomMeeting from './ZoomMeeting';
import Modal from '../../../layout/Modal';
import styles from './MeetingItem.module.css';
import { addPost } from '../../../../services/classroom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
const {
  CLASS_POST_TYPE_MEETING,
  ROLE_TEACHER,
} = require('../../../../constants/constants');
const dateFormat = require('dateformat');

export const MeetingItem = ({ meeting, user, loggedUser }) => {
  const [meetingInfo, setMeetingInfo] = useState({
    meeting_id: meeting.zoom_id,
    password: meeting.password,
    username: user.name,
    email: user.email,
    role: 0,
    inMeeting: false,
  });

  const [showModal, setShowModal] = useState(false);

  const joinMeetingHandler = (e) => {
    e.preventDefault();
    setMeetingInfo({ ...meetingInfo, inMeeting: true });
    setShowModal(true);
  };

  const startMeetingHandler = async (e) => {
    const fd = new FormData();
    fd.append(
      'text',
      `Meeting ${meeting.topic} đã bắt đầu, bạn có muốn tham gia không?`
    );
    fd.append('type', CLASS_POST_TYPE_MEETING);
    fd.append('zoom_id', meeting.zoom_id);
    fd.append('topic', meeting.topic);
    fd.append('password', meeting.password);
    fd.append('start_url', meeting.start_url);
    fd.append('start_time', meeting.start_time);
    fd.append('classroom', meeting.classroom);

    try {
      const response = await addPost(fd, meeting.classroom);
    } catch (err) {
      console.log(err);
    }

    window.open(meeting.start_url, '_blank');
  };

  const endMeetingHandler = (e) => {
    e.preventDefault();
    setMeetingInfo({ ...meetingInfo, inMeeting: false });
  };
  return (
    <div className={styles.meetingItem}>
      {/* <Modal setShowModal={setShowModal} showModal={showModal}>
        <div id='zmmtg-root'></div>
      </Modal> */}
      <h1>{meeting.topic}</h1>
      <p>Time: {dateFormat(meeting.start_time, "yyyy-mm-dd'T'HH:MM:ssZ")}</p>
      <p>Password: {meeting.password}</p>
      <div className={styles.meetingItem__options}>
        <button
          className={styles.meetingItem__joinBtn}
          onClick={(e) => joinMeetingHandler(e)}
        >
          Tham gia
        </button>
        {/* <a href={`${meeting.start_url}`}>Start</a> */}{' '}
        {loggedUser.role == ROLE_TEACHER ? (
          <button
            className={styles.meetingItem__startBtn}
            onClick={(e) => startMeetingHandler(e)}
          >
            Bắt đầu
          </button>
        ) : (
          ''
        )}
      </div>
      {meetingInfo.inMeeting ? (
        <div>
          <ZoomMeeting
            meetingNumber={meetingInfo.meeting_id}
            username={meetingInfo.username}
            password={meetingInfo.password}
            email={meetingInfo.email}
            role={meetingInfo.role}
          />
          <button onClick={(e) => endMeetingHandler(e)}>End</button>
        </div>
      ) : null}
    </div>
  );
};

MeetingItem.propTypes = {
  loggedUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  loggedUser: state.auth.user,
});

export default connect(mapStateToProps)(MeetingItem);
