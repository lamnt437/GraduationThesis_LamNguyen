import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GET_CLASS_NOTIFICATIONS,
  GET_CLASS_NOTIFICATIONS_SUCCESS,
  GET_CLASS_NOTIFICATIONS_ERROR,
  RESET_CLASS_NOTIFICATIONS,
  ADD_NOTIFICATION_ERROR,
  ADD_NOTIFICATION_SUCCESS,
} from './types';

toast.configure();

export const getClassNotifications = (classId) => async (dispatch) => {
  dispatch({
    type: GET_CLASS_NOTIFICATIONS,
  });

  try {
    const url = `/api/classroom/${classId}/notifications`;
    const res = await axios.get(url);
    const notifications = res.data.notifications;

    dispatch({
      type: GET_CLASS_NOTIFICATIONS_SUCCESS,
      payload: notifications,
    });
  } catch (err) {
    console.log({ error: err.response });

    dispatch({
      type: GET_CLASS_NOTIFICATIONS_ERROR,

      payload: {
        msg: err.response?.data?.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const addClassNotification = (text, classId) => async (dispatch) => {
  const url = `/api/classroom/${classId}/notifications`;

  const body = JSON.stringify({ text });

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.put(url, body, options);
    toast.success('Đăng thông báo thành công!', { autoClose: 3000 });
    dispatch({
      type: ADD_NOTIFICATION_SUCCESS,
      payload: response.data?.notification,
    });
  } catch (err) {
    toast.error(err.response?.data?.statusText, { autoClose: 3000 });
    dispatch({
      type: ADD_NOTIFICATION_ERROR,
      payload: {
        msg: err.response?.data?.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const resetClassNotifications = () => (dispatch) => {
  dispatch({
    type: RESET_CLASS_NOTIFICATIONS,
  });
};
