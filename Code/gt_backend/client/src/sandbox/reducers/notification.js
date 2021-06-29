import {
  GET_CLASS_NOTIFICATIONS,
  GET_CLASS_NOTIFICATIONS_SUCCESS,
  GET_CLASS_NOTIFICATIONS_ERROR,
  RESET_CLASS_NOTIFICATIONS,
  ADD_NOTIFICATION_ERROR,
  ADD_NOTIFICATION_SUCCESS,
} from '../actions/types';

const initialState = {
  notifications: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CLASS_NOTIFICATIONS:
      return {
        ...state,
        loading: true,
      };

    case GET_CLASS_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: payload,
        loading: false,
      };

    case GET_CLASS_NOTIFICATIONS_ERROR:
    case ADD_NOTIFICATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case ADD_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [payload, ...state.notifications],
        loading: false,
      };

    case RESET_CLASS_NOTIFICATIONS:
      return initialState;

    default:
      return state;
  }
}
