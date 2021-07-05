import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import classroom from './classroom';
import classDetail from './classDetail';
import post from './post';
import meeting from './meeting';
import notification from './notification';
import topic from './topic';

export default combineReducers({
  alert,
  auth,
  classroom,
  classDetail,
  post,
  meeting,
  notification,
  topic,
});
