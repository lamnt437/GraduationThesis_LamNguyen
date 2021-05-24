import {
  GET_CLASS_DETAIL,
  GET_CLASS_DETAIL_SUCCESS,
  CLASS_DETAIL_ERROR,
} from '../actions/types';

const initialState = {
  classDetail: {},
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CLASS_DETAIL:
      return {
        ...state,
        loading: true,
      };

    case GET_CLASS_DETAIL_SUCCESS:
      return {
        ...state,
        classDetail: payload,
        loading: false,
      };

    case CLASS_DETAIL_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
}
