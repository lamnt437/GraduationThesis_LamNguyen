import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../../utils/setAuthToken';

export const loadUser = () => async (dispatch) => {
  // check local storage
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });
  const url = '/api/auth';

  try {
    const res = await axios.post(url, body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const register = (name, email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // create user object
  // stringify
  // config
  // send request in a try catch

  const body = JSON.stringify({ name, password, email });
  const url = '/api/users';

  // things go oke then dispatch the register success action
  try {
    const response = await axios.post(url, body, config);

    // how to check response status? what is returned if unsuccessful?
    // object of errors?
    /* if register error, the response will go into catch error part */

    dispatch({ type: REGISTER_SUCCESS, payload: response.data });

    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({ type: REGISTER_FAIL });
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
