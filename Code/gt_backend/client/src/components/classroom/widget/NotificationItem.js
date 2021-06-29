import styles from './NotificationItem.module.css';
const dateFormat = require('dateformat');

const NotificationItem = ({ notification }) => {
  return (
    <div className={styles.notificationItem}>
      <div className={styles.notificationItem__top}>
        <h5>{notification.username}</h5>
        <p>
          {dateFormat(
            notification.created_at,
            'dddd, mmmm dS, yyyy, h:MM:ss TT'
          )}
        </p>
      </div>
      <div className={styles.notification__bottom}>
        <p>{notification.text}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
