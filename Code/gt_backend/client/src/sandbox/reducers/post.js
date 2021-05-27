import {
  GET_POSTS,
  GET_POSTS_SUCCESS,
  POST_ERROR,
  RESET_POSTS,
  ADD_POST_ERROR,
  ADD_POST_SUCCESS,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_ERROR,
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
    case ADD_COMMENT_ERROR:
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

    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id == payload.id) {
            post.comments.push(payload.comment);
          }
          return post;
        }),
        loading: false,
      };

    default:
      return state;
  }
}
