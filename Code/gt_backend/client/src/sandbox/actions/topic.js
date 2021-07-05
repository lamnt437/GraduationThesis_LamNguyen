import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GET_CLASS_TOPICS,
  GET_CLASS_TOPICS_SUCCESS,
  GET_CLASS_TOPICS_ERROR,
  RESET_CLASS_TOPICS,
  ADD_TOPIC_ERROR,
  ADD_TOPIC_SUCCESS,
} from './types';

toast.configure();

export const getClassTopics = (classId) => async (dispatch) => {
  dispatch({
    type: GET_CLASS_TOPICS,
  });

  console.log('fetch topic from ' + classId);
  try {
    const url = `/api/classroom/${classId}/topics`;
    const res = await axios.get(url);
    const topics = res.data.topics;

    dispatch({
      type: GET_CLASS_TOPICS_SUCCESS,
      payload: topics,
    });
  } catch (err) {
    console.log({ error: err.response });

    dispatch({
      type: GET_CLASS_TOPICS_ERROR,

      payload: {
        msg: err.response?.data?.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const addClassTopic = (text, classId) => async (dispatch) => {
  const url = `/api/classroom/${classId}/topics`;

  const body = JSON.stringify({ text });

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(url, body, options);
    toast.success('Thêm chủ điểm thành công!', { autoClose: 3000 });
    dispatch({
      type: ADD_TOPIC_SUCCESS,
      payload: response.data?.topic,
    });
  } catch (err) {
    toast.error(err.response?.data?.statusText, { autoClose: 3000 });
    dispatch({
      type: ADD_TOPIC_ERROR,
      payload: {
        msg: err.response?.data?.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const resetClassTopics = () => (dispatch) => {
  dispatch({
    type: RESET_CLASS_TOPICS,
  });
};
