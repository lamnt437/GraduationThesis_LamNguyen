import React, { useState } from 'react';
import ZoomMeeting from './ZoomMeeting';
const dateFormat = require('dateformat');

export const MeetingItem = ({ meeting }) => {
  const [meetingInfo, setMeetingInfo] = useState({
    meeting_id: meeting.meeting_id,
    password: meeting.password,
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
      <h1>{meeting.topic}</h1>
      <p>Time: {dateFormat(meeting.start_time, "yyyy-mm-dd'T'HH:MM:ssZ")}</p>
      <p>Password: {meeting.password}</p>
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
