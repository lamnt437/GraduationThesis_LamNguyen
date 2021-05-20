import axios from 'axios';
import {
  LOAD_CLASS_FAIL,
  LOAD_CLASS_SUCCESS,
  CREATE_CLASS_SUCCESS,
  CREATE_CLASS_FAIL,
} from './types';

export const getClassDetail = (id) => async (dispatch) => {
  const url = `/api/classroom/${id}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.get(url, {}, config);
    const { name, description, _id, posts } = response.data.classroom;
    const meetings = response.data.classroom.meeting_ids;
    const members = response.data.classroom.member_ids;
    const supervisors = response.data.classroom.supervisor_ids;

    dispatch({
      type: LOAD_CLASS_SUCCESS,
      payload: {
        name,
        description,
        _id,
        posts: response.data.classro,
        meetings,
        members,
        supervisors,
        created_at: null,
      },
    });
  } catch (err) {
    console.log(err);
    dispatch({ type: LOAD_CLASS_FAIL });
  }
};

export const createClass = (name, description) => async (dispatch) => {
  const url = '/api/classroom';

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log({
    createClass: {
      name,
      description,
    },
  });

  const payload = {
    name,
    description,
  };

  const body = JSON.stringify(payload);
  console.log({ body });

  try {
    const response = await axios.post(url, body, options);
    console.log(response);

    dispatch({ type: CREATE_CLASS_SUCCESS });
  } catch (error) {
    console.log(error.message);
    dispatch({ type: CREATE_CLASS_FAIL });
  }
};
