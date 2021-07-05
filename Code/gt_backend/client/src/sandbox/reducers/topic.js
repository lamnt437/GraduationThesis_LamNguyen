import {
  GET_CLASS_TOPICS,
  GET_CLASS_TOPICS_SUCCESS,
  GET_CLASS_TOPICS_ERROR,
  RESET_CLASS_TOPICS,
  ADD_TOPIC_ERROR,
  ADD_TOPIC_SUCCESS,
} from '../actions/types';

const initialState = {
  topics: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CLASS_TOPICS:
      return {
        ...state,
        loading: true,
      };

    case GET_CLASS_TOPICS_SUCCESS:
      return {
        ...state,
        topics: payload,
        loading: false,
      };

    case GET_CLASS_TOPICS_ERROR:
    case ADD_TOPIC_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case ADD_TOPIC_SUCCESS:
      return {
        ...state,
        topics: [...state.topics, payload],
        loading: false,
      };

    case RESET_CLASS_TOPICS:
      return initialState;

    default:
      return state;
  }
}
