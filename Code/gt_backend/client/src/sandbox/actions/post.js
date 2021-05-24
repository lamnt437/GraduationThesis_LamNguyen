import {
  GET_POSTS,
  GET_POSTS_SUCCESS,
  POST_ERROR,
  RESET_POSTS,
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
        msg: err.response?.statusText,
        status: err.response?.status,
      },
    });
  }
};

export const resetPosts = () => (dispatch) => {
  dispatch({
    type: RESET_POSTS,
  });
};
