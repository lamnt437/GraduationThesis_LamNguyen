import axios from 'axios';
import { fetchClassRooms } from '../../services/classroom';
import {
  CREATE_CLASS_SUCCESS,
  CREATE_CLASS_ERROR,
  GET_CLASSROOMS,
  CLASSROOMS_ERROR,
} from './types';

export const getClassrooms = () => async (dispatch) => {
  try {
    const res = await fetchClassRooms();

    dispatch({
      type: GET_CLASSROOMS,
      payload: res.data.classrooms,
    });
  } catch (err) {
    dispatch({
      type: CLASSROOMS_ERROR,
      payload: {
        msg: err.response?.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const createClass = (name, description) => async (dispatch) => {
  const url = '/api/classroom';

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const payload = {
    name,
    description,
  };

  const body = JSON.stringify(payload);

  try {
    const response = await axios.post(url, body, options);
    console.log({ response });

    dispatch({ type: CREATE_CLASS_SUCCESS, payload: response.data.classroom });
  } catch (error) {
    console.log(error.message);
    dispatch({
      type: CREATE_CLASS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
