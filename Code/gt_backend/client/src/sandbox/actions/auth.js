import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL, REMOVE_ALERT } from './types';
import { setAlert } from './alert';

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
  const url = 'http://localhost:3001/api/users';

  // things go oke then dispatch the register success action
  try {
    const response = await axios.post(url, body, config);

    // how to check response status? what is returned if unsuccessful?
    // object of errors?
    /* if register error, the response will go into catch error part */

    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({ type: REGISTER_FAIL });
  }
};
