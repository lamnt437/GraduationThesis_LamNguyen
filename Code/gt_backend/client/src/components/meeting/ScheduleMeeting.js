import axios from 'axios';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

export const ScheduleMeeting = () => {
  const [meetingData, setMeetingData] = useState({
    start_time: Date.now,
    topic: '',
    password: '',
  });

  const { topic, start_time, password } = meetingData;

  const onSubmit = async (e) => {
    e.preventDefault();

    const url = '/api/meeting/schedule';

    const meeting = {
      topic,
      start_time,
      password,
    };

    const body = JSON.stringify(meeting);
    console.log(body);

    const reqConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(url, body, reqConfig);
      console.log(response);
    } catch (err) {
      console.error(err.message);
    }

    // create a meeting object
    // send using axios
  };

  const onChange = (e) => {
    setMeetingData({ ...meetingData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Schedule a Meeting now!</h1>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Meeting topic'
            name='topic'
            value={topic}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='datetime-local'
            name='start_time'
            value={start_time}
            required
            step='1'
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Password'
            name='password'
            value={password}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Set up' />
      </form>
      <p className='my-1'>
        Already scheduled? <Link to='/meeting'>Join Meeting</Link>
      </p>
    </Fragment>
  );
};

export default ScheduleMeeting;
