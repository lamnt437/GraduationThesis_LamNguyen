import axios from 'axios';
import { LOAD_CLASS_FAIL, LOAD_CLASS_SUCCESS } from './types';

export const getClassDetail = (id) => async (dispatch) => {
  const url = `http://localhost:3001/api/classroom/${id}`;

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
