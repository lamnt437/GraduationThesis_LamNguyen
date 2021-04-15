import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

// return the correct state to the subscribed component that ask for auth state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  users: null,
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
