import styles from './NotificationItem.module.css';
import TimeAgo from 'javascript-time-ago';
import vi from 'javascript-time-ago/locale/vi';

TimeAgo.addLocale(vi);

// Create formatter (English).
var timeAgo = new TimeAgo('vi');

const NotificationItem = ({ notification }) => {
  return (
    <div className={styles.notificationItem}>
      <div className={styles.notificationItem__top}>
        <h5>{notification.username}</h5>
      </div>
      <div className={styles.notification__bottom}>
        <p>{notification.text}</p>
      </div>
      <div style={{ 'margin-top': '5px', 'font-size': '13px' }}>
        <p>{timeAgo.format(new Date(notification.created_at))}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
