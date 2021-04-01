import React, { useState, Fragment } from "react";
import ZoomMeeting from "./ZoomMeeting";

export const Meeting = () => {
  const [meetingState, setMeetingState] = useState({
    inMeeting: false,
    meetingNumber: "",
    role: 0,
    username: "",
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setMeetingState({ ...meetingState, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    setMeetingState({ ...meetingState, inMeeting: true });
  };

  return meetingState.inMeeting ? (
    <ZoomMeeting
      meetingNumber={meetingState.meetingNumber}
      role={meetingState.role}
      username={meetingState.username}
      email={meetingState.email}
      password={meetingState.password}
    />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Join meeting</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Enter meeting number to join meeting
        without login
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Meeting Number"
            name="meetingNumber"
            value={meetingState.meetingNumber}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={meetingState.username}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={meetingState.email}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={meetingState.password}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Join" />
      </form>
    </Fragment>
  );
};

export default Meeting;
