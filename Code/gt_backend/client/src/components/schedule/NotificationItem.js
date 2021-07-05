import { useHistory } from 'react-router-dom';
import styles from './NotificationItem.module.css';
const dateFormat = require('dateformat');

const NotificationItem = ({ notification }) => {
  const history = useHistory();

  const onClickHandler = (e) => {
    history.push(`/classroom/${notification.classroom}`);
  };
  return (
    <div className={styles.notificationItem} onClick={(e) => onClickHandler(e)}>
      <div className={styles.notificationItem__top}>
        <h5>{notification.classname}</h5>
      </div>
      <div>
        <p>
          {dateFormat(
            notification.created_at,
            'dddd, mmmm dS, yyyy, h:MM:ss TT'
          )}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
