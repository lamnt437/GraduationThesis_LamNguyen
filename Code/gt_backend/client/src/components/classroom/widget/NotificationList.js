import { useEffect, useState } from 'react';
import styles from './NotificationList.module.css';
import NotificationItem from './NotificationItem';
import Loading from '../../layout/Loading';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getClassNotifications,
  addClassNotification,
  resetClassNotifications,
} from '../../../sandbox/actions/notification';
import { ROLE_TEACHER } from '../../../constants/constants';

// fetch notification item

const NotificationList = ({
  classId,
  getClassNotifications,
  addClassNotification,
  notification: { loading, notifications },
  user,
}) => {
  useEffect(() => {
    getClassNotifications(classId);

    return () => {
      resetClassNotifications();
    };
  }, [getClassNotifications]);

  return (
    <div className={styles.notificationList}>
      <h1 style={{ 'margin-bottom': '15px' }}>Thông báo</h1>
      {user.role == ROLE_TEACHER ? (
        <NotificationSender
          classId={classId}
          addClassNotification={addClassNotification}
        />
      ) : (
        ''
      )}
      {loading ? (
        <Loading />
      ) : (
        Array.isArray(notifications) &&
        notifications.map((notification) => (
          <NotificationItem
            notification={notification}
            key={notification._id}
          />
        ))
      )}
    </div>
  );
};

const NotificationSender = ({ classId, addClassNotification }) => {
  const [text, setText] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    addClassNotification(text, classId);

    setText('');
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className={styles.notificationSender}>
      <div className={styles.notificationSender__top}>
        <form>
          <input
            className={styles.notificationSender__input}
            placeholder='Thông báo mới'
            onChange={(e) => onChange(e)}
            value={text}
            name='text'
          />
          <button onClick={submitHandler} type='submit'>
            Đăng
          </button>
        </form>
      </div>
    </div>
  );
};

NotificationList.propTypes = {
  notification: PropTypes.object.isRequired,
  getClassNotifications: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  notification: state.notification,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getClassNotifications,
  resetClassNotifications,
  addClassNotification,
})(NotificationList);
