import React, { useState } from 'react';
import ZoomMeeting from './ZoomMeeting';
const dateFormat = require('dateformat');

export const MeetingItem = (props) => {
  const [meetingInfo, setMeetingInfo] = useState({
    meeting_id: props.meeting_id,
    password: props.password,
    username: 'Unknown',
    email: 'unknown@email.com',
    role: 0,
    inMeeting: false,
  });

  const onClick = (e) => {
    e.preventDefault();
    setMeetingInfo({ ...meetingInfo, inMeeting: true });
    // console.log(meetingInfo);
  };
  return (
    <div>
      <h1>{props.topic}</h1>
      <p>Time: {dateFormat(props.start_time, "yyyy-mm-dd'T'HH:MM:ssZ")}</p>
      <p>Password: {props.password}</p>
      <button onClick={(e) => onClick(e)}>Meet</button>

      {meetingInfo.inMeeting ? (
        <ZoomMeeting
          meetingNumber={meetingInfo.meeting_id}
          username={meetingInfo.username}
          password={meetingInfo.password}
          email={meetingInfo.email}
          role={meetingInfo.role}
        />
      ) : null}
    </div>
  );
};

export default MeetingItem;
