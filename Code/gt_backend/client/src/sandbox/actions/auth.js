import { v4 as uuidv4 } from 'uuid';
import { REGISTER_SUCCESS, REGISTER_FAIL, REMOVE_ALERT } from './types';

export const setRegisterSuccess = (msg, alertType, timeout = 3000) => (
  dispatch
) => {
  const id = uuidv4();

  dispatch({
    type: REGISTER_SUCCESS,
    payload: {
      msg,
      alertType,
      id,
    },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

export const setRegisterFail = (errors, alertType, timeout = 3000) => (
  dispatch
) => {
  for (let i = 0; i < errors.length; i++) {
    const id = uuidv4();

    const msg = errors[i].msg;

    dispatch({
      type: REGISTER_FAIL,
      payload: {
        msg,
        alertType,
        id,
      },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  }
};
