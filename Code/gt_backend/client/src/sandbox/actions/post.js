import axios from 'axios';
import {
  GET_POSTS,
  GET_POSTS_SUCCESS,
  POST_ERROR,
  RESET_POSTS,
  ADD_POST_SUCCESS,
  ADD_POST_ERROR,
  ADD_COMMENT_ERROR,
  ADD_COMMENT_SUCCESS,
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
    console.log({ posts });

    dispatch({
      type: GET_POSTS_SUCCESS,
      payload: posts,
    });
  } catch (err) {
    console.log({ error: err.response });
    dispatch({
      type: POST_ERROR,

      payload: {
        msg: err.response?.data?.statusText,
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
        msg: err.response?.data?.statusText,
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

export const addComment = (postId, comment) => async (dispatch) => {
  const url = `/api/posts/${postId}/comment`;

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    text: comment,
  });

  try {
    const response = await axios.put(url, body, options);
    dispatch({
      type: ADD_COMMENT_SUCCESS,
      payload: {
        id: postId,
        comment: response.data?.comment,
      },
    });
  } catch (err) {
    dispatch({
      type: ADD_COMMENT_ERROR,
      payload: {
        msg: err.response?.data?.statusText,
        status: err.response?.status,
      },
    });
  }
};
