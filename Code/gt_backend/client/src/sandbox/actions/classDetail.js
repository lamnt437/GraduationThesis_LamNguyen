import { fetchClassroom } from '../../services/classroom';
import {
  GET_CLASS_DETAIL,
  CLASS_DETAIL_ERROR,
  GET_CLASS_DETAIL_SUCCESS,
  RESET_CLASS_DETAIL,
} from './types';

export const getClassDetail = (id) => async (dispatch) => {
  dispatch({
    type: GET_CLASS_DETAIL,
  });

  try {
    const response = await fetchClassroom(id);
    const classroom = response.data.classroom;

    dispatch({
      type: GET_CLASS_DETAIL_SUCCESS,
      payload: classroom,
    });
  } catch (err) {
    dispatch({
      type: CLASS_DETAIL_ERROR,
      payload: {
        msg: err.response?.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const resetClassDetail = () => (dispatch) => {
  dispatch({
    type: RESET_CLASS_DETAIL,
  });
};
