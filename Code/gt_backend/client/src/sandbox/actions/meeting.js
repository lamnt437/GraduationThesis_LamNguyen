import {
  GET_MEETINGS,
  GET_MEETINGS_SUCCESS,
  MEETING_ERROR,
  RESET_MEETINGS,
  ADD_MEETING_ERROR,
  ADD_MEETING_SUCCESS,
  ADD_MEETING,
} from '../actions/types';
import { CLASS_POST_TYPE_MEETING } from '../../constants/constants';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchMeetingFromClassroom } from '../../services/meeting';
import {
  addMeeting as addMeetingToClassroom,
  addPost,
} from '../../services/classroom';

toast.configure();

export const getMeetings = (classId) => async (dispatch) => {
  console.log(`fetching ${classId}`);

  dispatch({
    type: GET_MEETINGS,
  });

  try {
    const res = await fetchMeetingFromClassroom(classId);
    const meetings = res.data.meetings;

    dispatch({
      type: GET_MEETINGS_SUCCESS,
      payload: meetings,
    });
  } catch (err) {
    console.log({ error: err.response });

    dispatch({
      type: MEETING_ERROR,

      payload: {
        msg: err.response?.data?.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const addMeeting =
  (
    classId,
    topic,
    description,
    start_time,
    duration,
    password,
    type,
    recurrence
  ) =>
  async (dispatch) => {
    dispatch({
      type: ADD_MEETING,
    });
    try {
      const response = await addMeetingToClassroom(
        classId,
        topic,
        description,
        start_time,
        duration,
        password,
        type,
        recurrence
      );

      const createdMeeting = response.data.meeting;

      // console.log({ response: response.data });

      // TODO if return 403 you don't have permission to create meeting

      // TODO redirect or something
      const fd = new FormData();
      fd.append('text', `Meeting ${createdMeeting.topic} đã được lên lịch!`);
      fd.append('zoom_id', createdMeeting.zoom_id);
      fd.append('topic', createdMeeting.topic);
      fd.append('start_time', createdMeeting.start_time);
      fd.append('start_url', createdMeeting.start_url);
      fd.append('password', createdMeeting.password);
      fd.append('classroom', classId);
      fd.append('type', CLASS_POST_TYPE_MEETING);

      await addPost(fd, classId);

      toast.success('Tạo meeting thành công!', { autoClose: 3000 });

      dispatch({
        type: ADD_MEETING_SUCCESS,
        payload: response.data?.meeting,
      });
    } catch (err) {
      toast.error(err.response?.data?.errors[0].msg, { autoClose: 3000 });
      dispatch({
        type: ADD_MEETING_ERROR,
        payload: {
          msg: err.response?.data?.errors[0].msg,
          status: err.response?.status,
        },
      });
    }
  };

export const resetMeetings = () => (dispatch) => {
  dispatch({
    type: RESET_MEETINGS,
  });
};
