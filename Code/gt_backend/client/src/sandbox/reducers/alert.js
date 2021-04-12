// get action and return state accordingly
import {
  SET_ALERT,
  REMOVE_ALERT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case (SET_ALERT, REGISTER_FAIL, REGISTER_SUCCESS):
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id != payload);
    default:
      return state;
  }
}
