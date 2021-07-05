import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { fetchPosts, fetchFilteredPosts } from '../../services/classroom';

toast.configure();

export const getPosts = (classId) => async (dispatch) => {
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

export const getFilteredPosts = (classId, topic) => async (dispatch) => {
  dispatch({
    type: GET_POSTS,
  });

  try {
    const res = await fetchFilteredPosts(classId, topic);
    const posts = res.data.posts;

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
    toast.success('Đăng bài thành công!', { autoClose: 3000 });
    dispatch({
      type: ADD_POST_SUCCESS,
      payload: response.data?.post,
    });
  } catch (err) {
    toast.error(err.response?.data?.statusText, { autoClose: 3000 });
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
    toast.success('Bình luận thành công!', { autoClose: 3000 });
    dispatch({
      type: ADD_COMMENT_SUCCESS,
      payload: {
        id: postId,
        comment: response.data?.comment,
      },
    });
  } catch (err) {
    console.log('show toast');
    console.log(err.response);
    toast.error(err.response?.data?.errors[0].msg, { autoClose: 3000 });
    dispatch({
      type: ADD_COMMENT_ERROR,
      payload: {
        msg: err.response?.data?.statusText,
        status: err.response?.status,
      },
    });
  }
};
