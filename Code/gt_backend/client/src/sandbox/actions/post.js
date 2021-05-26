import axios from 'axios';
import {
  GET_POSTS,
  GET_POSTS_SUCCESS,
  POST_ERROR,
  RESET_POSTS,
  ADD_POST_SUCCESS,
  ADD_POST_ERROR,
} from '../actions/types';
import { fetchPosts } from '../../services/classroom';

export const getPosts = (classId) => async (dispatch) => {
  console.log(`fetching ${classId}`);

  dispatch({
    type: GET_POSTS,
  });

  try {
    const res = await fetchPosts(classId);
    const posts = res.data.posts;

    dispatch({
      type: GET_POSTS_SUCCESS,
      payload: posts,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.data.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const addPost = (fd, classId) => async (dispatch) => {
  const url = `/api/classroom/${classId}/posts`;

  try {
    const response = await axios.put(url, fd);
    dispatch({
      type: ADD_POST_SUCCESS,
      payload: response.data?.post,
    });
  } catch (err) {
    dispatch({
      type: ADD_POST_ERROR,
      payload: {
        msg: err.response.data.statusText,
        status: err.response.status,
      },
    });
  }
};

export const resetPosts = () => (dispatch) => {
  dispatch({
    type: RESET_POSTS,
  });
};
