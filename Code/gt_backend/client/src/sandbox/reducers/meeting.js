import {
  GET_MEETINGS,
  GET_MEETINGS_SUCCESS,
  MEETING_ERROR,
  RESET_MEETINGS,
  ADD_MEETING_ERROR,
  ADD_MEETING_SUCCESS,
  ADD_MEETING,
} from '../actions/types';

const initialState = {
  meetings: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_MEETING:
    case GET_MEETINGS:
      return {
        ...state,
        loading: true,
      };

    case GET_MEETINGS_SUCCESS:
      return {
        ...state,
        meetings: payload,
        loading: false,
      };

    case MEETING_ERROR:
    case ADD_MEETING_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case ADD_MEETING_SUCCESS:
      return {
        ...state,
        meetings: [payload, ...state.meetings],
        loading: false,
      };

    case RESET_MEETINGS:
      return initialState;

    default:
      return state;
  }
}
