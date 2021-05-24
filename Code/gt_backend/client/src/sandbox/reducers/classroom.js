import {
  CREATE_CLASS_SUCCESS,
  CREATE_CLASS_ERROR,
  GET_CLASSROOMS,
  CLASSROOMS_ERROR,
} from '../actions/types';

const initialState = {
  classrooms: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CLASSROOMS:
      return {
        ...state,
        classrooms: payload,
        loading: false,
      };

    case CLASSROOMS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case CREATE_CLASS_SUCCESS:
      return {
        ...state,
        classrooms: [payload, ...state.classrooms],
        loading: false,
      };

    case CREATE_CLASS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
}
