import { useState } from 'react';
import { addMeeting } from '../../../../services/classroom';

const MeetingScheduler = ({ classId }) => {
  // TODO formal create meeting form from zoom
  const [meetingInfo, setMeetingInfo] = useState({
    topic: '',
    description: '',
    duration: 40,
    start_time: Date.now(),
    recurrence: {},
    type: 2,
    password: '',
  });

  const {
    topic,
    description,
    duration,
    start_time,
    recurrence,
    type,
    password,
  } = meetingInfo;

  const onChange = (e) => {
    setMeetingInfo({ ...meetingInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addMeeting(
        classId,
        topic,
        description,
        start_time,
        duration,
        password,
        type,
        recurrence
      );
      // TODO redirect or something
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className='large text-primary'>Schedule a Meeting now!</h1>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <label for='topic'>Tiêu đề</label>
          <input
            type='text'
            placeholder='Tiêu đề'
            name='topic'
            value={topic}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <label for='description'>Mô tả (không bắt buộc)</label>
          <input
            type='text'
            placeholder='Mô tả (không bắt buộc)'
            name='description'
            value={description}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <label for='start_time'>Thời điểm bắt đầu</label>
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
          <label for='duration'>Thời lượng</label>
          <input
            type='number'
            name='duration'
            placeholder='Kéo dài trong'
            value={duration}
            required
            step='1'
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <label for='password'>Mật khẩu</label>
          <input
            type='text'
            placeholder='Mật khẩu'
            name='password'
            value={password}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Lưu' />
      </form>
    </div>
  );
};

export default MeetingScheduler;
