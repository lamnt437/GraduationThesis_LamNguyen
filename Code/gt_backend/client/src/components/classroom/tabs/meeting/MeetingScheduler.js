import { useState } from 'react';
import { addMeeting } from '../../../../services/classroom';
import {
  MEETING_TYPE_INSTANT,
  MEETING_TYPE_SCHEDULED,
  MEETING_TYPE_RECURRING_NOFIX,
  MEETING_TYPE_RECURRING,
  RECURRENCE_MEETING_TYPE_DAILY,
  RECURRENCE_MEETING_TYPE_WEEKLY,
  RECURRENCE_MEETING_TYPE_MONTHLY,
} from '../../../../constants/constants';
import { weekdays } from 'moment';

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
    isRecurring: false,
  });

  const [recurrenceType, setRecurrenceType] = useState(
    RECURRENCE_MEETING_TYPE_WEEKLY
  );

  const [dailyRecurrence, setDailyRecurrence] = useState({
    type: RECURRENCE_MEETING_TYPE_DAILY,
    repeat_interval: 1,
    end_times: 10,
  });

  const [weeklyRecurrence, setWeeklyRecurrence] = useState({
    type: RECURRENCE_MEETING_TYPE_WEEKLY,
    repeat_interval: 1,
    end_times: 10,
    weekly_days: '2',
  });

  const [weeklyDays, setWeeklyDays] = useState([2]);

  const onChangeRecurrenceType = (e) => {
    const typeSelected = parseInt(e.currentTarget.value);

    if (typeSelected == RECURRENCE_MEETING_TYPE_DAILY) {
      console.log('Daily');
      setRecurrenceType(RECURRENCE_MEETING_TYPE_DAILY);
      setMeetingInfo({ ...meetingInfo, recurrence: dailyRecurrence });
    } else if (typeSelected == RECURRENCE_MEETING_TYPE_WEEKLY) {
      console.log('Weekly');
      setRecurrenceType(RECURRENCE_MEETING_TYPE_WEEKLY);
      setMeetingInfo({ ...meetingInfo, recurrence: weeklyRecurrence });
    }
  };

  const onChangeDailyRecurrence = (e) => {
    setDailyRecurrence({
      ...dailyRecurrence,
      [e.target.name]: parseInt(e.target.value),
    });
    setMeetingInfo({
      ...meetingInfo,
      recurrence: {
        ...dailyRecurrence,
        [e.target.name]: parseInt(e.target.value),
      },
    });
  };

  const onChangeWeeklyRecurrence = (e) => {
    setWeeklyRecurrence({
      ...weeklyRecurrence,
      [e.target.name]: parseInt(e.target.value),
    });
    setMeetingInfo({
      ...meetingInfo,
      recurrence: {
        ...weeklyRecurrence,
        [e.target.name]: parseInt(e.target.value),
      },
    });
  };

  const arrayToString = (arr) => {
    let str = '';
    arr.forEach((i, index) => {
      str += i;
      if (index != arr.length - 1) {
        str += ',';
      }
    });
    return str;
  };

  const onChangeWeeklyDays = (e) => {
    const weeklyDay = parseInt(e.currentTarget.value);
    let newWeeklyDays;

    if (e.currentTarget.checked) {
      newWeeklyDays = [...weeklyDays, weeklyDay];
    } else {
      newWeeklyDays = weeklyDays.filter((day) => day != weeklyDay);
    }
    setWeeklyDays(newWeeklyDays.sort());
    const weeklyDaysString = arrayToString(newWeeklyDays);

    setWeeklyRecurrence({
      ...weeklyRecurrence,
      weekly_days: weeklyDaysString,
    });
    setMeetingInfo({
      ...meetingInfo,
      recurrence: { ...weeklyRecurrence, weekly_days: weeklyDaysString },
    });
  };

  const {
    topic,
    description,
    duration,
    start_time,
    type,
    password,
    isRecurring,
  } = meetingInfo;

  const onChange = (e) => {
    setMeetingInfo({ ...meetingInfo, [e.target.name]: e.target.value });
  };

  const onChangeRecurring = (e) => {
    const newIsRecurring = !isRecurring;
    // console.log({ meetingInfo });
    if (newIsRecurring) {
      setMeetingInfo({
        ...meetingInfo,
        isRecurring: newIsRecurring,
        type: 8,
        recurrence: weeklyRecurrence,
      });
    } else {
      setMeetingInfo({
        ...meetingInfo,
        isRecurring: newIsRecurring,
        type: 2,
        recurrence: {},
      });
    }
  };

  // TODO confirmation modal before sending
  const onSubmit = async (e) => {
    e.preventDefault();

    console.log({ meetingInfo });

    try {
      const response = await addMeeting(
        classId,
        topic,
        description,
        start_time,
        duration,
        password,
        type,
        meetingInfo.recurrence
      );
      // TODO redirect or something
      // TODO schedule recurrent meeting
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className='large text-primary'>Schedule a Meeting now!</h1>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <label htmlFor='topic'>Tiêu đề</label>
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
          <label htmlFor='description'>Mô tả (không bắt buộc)</label>
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
          <label htmlFor='start_time'>Thời điểm bắt đầu</label>
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
          <label htmlFor='duration'>Thời lượng</label>
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
          <label htmlFor='password'>Mật khẩu</label>
          <input
            type='text'
            placeholder='Mật khẩu'
            name='password'
            value={password}
            required
            onChange={(e) => onChange(e)}
          />
        </div>

        {/* recurring or not */}
        <div className='form-group'>
          <label htmlFor='is_recurring'>Đây là meeting lặp đi lặp lại?</label>
          <input
            type='checkbox'
            name='is_recurring'
            defaultChecked={isRecurring}
            onChange={(e) => onChangeRecurring(e)}
          />
        </div>

        {isRecurring ? (
          <div className='form-group'>
            <p>Lặp lại hàng ngày, hàng tuần</p>
            <input
              type='radio'
              name='recurrence_meeting_type'
              onChange={(e) => onChangeRecurrenceType(e)}
              value={RECURRENCE_MEETING_TYPE_DAILY}
              checked={recurrenceType == RECURRENCE_MEETING_TYPE_DAILY}
              id='daily'
            />
            <label htmlFor='daily'>Hằng ngày</label>

            <input
              type='radio'
              name='recurrence_meeting_type'
              onChange={(e) => onChangeRecurrenceType(e)}
              value={RECURRENCE_MEETING_TYPE_WEEKLY}
              id='weekly'
              checked={recurrenceType == RECURRENCE_MEETING_TYPE_WEEKLY}
              disabled={!isRecurring}
            />
            <label htmlFor='weekly'>Hằng tuần</label>

            <div>
              {/* TODO */}
              {recurrenceType == RECURRENCE_MEETING_TYPE_DAILY ? (
                <div>
                  <div className='form-group'>
                    <label htmlFor='repeat_interval'>
                      Khoảng thời gian giữa mỗi buổi học
                    </label>
                    <input
                      type='number'
                      name='repeat_interval'
                      step='1'
                      min='1'
                      value={dailyRecurrence.repeat_interval}
                      onChange={(e) => onChangeDailyRecurrence(e)}
                    />{' '}
                    ngày
                  </div>

                  <div className='form-group'>
                    <label htmlFor='end_times'>Số buổi</label>
                    <input
                      type='number'
                      name='end_times'
                      step='1'
                      min='1'
                      value={dailyRecurrence.end_times}
                      onChange={(e) => onChangeDailyRecurrence(e)}
                    />{' '}
                    buổi
                  </div>
                </div>
              ) : (
                ''
              )}
              {recurrenceType == RECURRENCE_MEETING_TYPE_WEEKLY ? (
                <div>
                  <div className='form-group'>
                    <label htmlFor='repeat_interval'>
                      Diễn ra vào các ngày trong tuần
                    </label>
                    <div>
                      <input
                        type='checkbox'
                        name='weekly_days'
                        value='2'
                        onChange={(e) => onChangeWeeklyDays(e)}
                        checked={weeklyDays.includes(2)}
                      />{' '}
                      Thứ 2{' '}
                      <input
                        type='checkbox'
                        name='weekly_days'
                        value='3'
                        onChange={(e) => onChangeWeeklyDays(e)}
                        checked={weeklyDays.includes(3)}
                      />{' '}
                      Thứ 3{' '}
                      <input
                        type='checkbox'
                        name='weekly_days'
                        value='4'
                        onChange={(e) => onChangeWeeklyDays(e)}
                        checked={weeklyDays.includes(4)}
                      />{' '}
                      Thứ 4{' '}
                      <input
                        type='checkbox'
                        name='weekly_days'
                        value='5'
                        onChange={(e) => onChangeWeeklyDays(e)}
                        checked={weeklyDays.includes(5)}
                      />{' '}
                      Thứ 5{' '}
                      <input
                        type='checkbox'
                        name='weekly_days'
                        value='6'
                        onChange={(e) => onChangeWeeklyDays(e)}
                        checked={weeklyDays.includes(6)}
                      />{' '}
                      Thứ 6{' '}
                      <input
                        type='checkbox'
                        name='weekly_days'
                        value='7'
                        onChange={(e) => onChangeWeeklyDays(e)}
                        checked={weeklyDays.includes(7)}
                      />{' '}
                      Thứ 7{' '}
                      <input
                        type='checkbox'
                        name='weekly_days'
                        value='1'
                        onChange={(e) => onChangeWeeklyDays(e)}
                        checked={weeklyDays.includes(1)}
                      />{' '}
                      Chủ nhật
                    </div>
                  </div>

                  <div className='form-group'>
                    <label htmlFor='repeat_interval'>
                      Khoảng thời gian giữa mỗi tuần học
                    </label>
                    <input
                      type='number'
                      name='repeat_interval'
                      step='1'
                      min='1'
                      value={weeklyRecurrence.repeat_interval}
                      onChange={(e) => onChangeWeeklyRecurrence(e)}
                    />{' '}
                    tuần
                  </div>

                  <div className='form-group'>
                    <label htmlFor='end_times'>Số buổi</label>
                    <input
                      type='number'
                      name='end_times'
                      step='1'
                      min='1'
                      value={weeklyRecurrence.end_times}
                      onChange={(e) => onChangeWeeklyRecurrence(e)}
                    />{' '}
                    buổi
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        ) : (
          ''
        )}

        <input type='submit' className='btn btn-primary' value='Lưu' />
      </form>
    </div>
  );
};

export default MeetingScheduler;
