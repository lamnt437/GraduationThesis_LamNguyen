import {
  GET_POSTS,
  GET_POSTS_SUCCESS,
  POST_ERROR,
  RESET_POSTS,
  ADD_POST_ERROR,
  ADD_POST_SUCCESS,
} from '../actions/types';

const initialState = {
  posts: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        loading: true,
      };

    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };

    case POST_ERROR:
    case ADD_POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case ADD_POST_SUCCESS:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
      };

    case RESET_POSTS:
      return initialState;

    default:
      return state;
  }
}
