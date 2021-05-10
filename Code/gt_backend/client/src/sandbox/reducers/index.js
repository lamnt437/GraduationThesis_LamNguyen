import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import classroom from './classroom';

export default combineReducers({
  alert,
  auth,
  classroom,
});
