import { useEffect, useState } from 'react';
import styles from './NotificationPanel.module.css';
import NotificationItem from './NotificationItem';
import Loading from '../layout/Loading';
import { fetchNewNotifications } from '../../services/notification';

// fetch notification item

const NotificationPanel = () => {
  const [newNotifications, setNewNotifications] = useState({
    notifications: null,
    loading: true,
  });
  useEffect(async () => {
    try {
      const response = await fetchNewNotifications();
      console.log({ response: response.data });
      setNewNotifications({
        notifications: response.data.notificationTimeline,
        loading: false,
      });
    } catch (err) {
      console.error(err.message);
    }
  }, [fetchNewNotifications]);

  const { notifications, loading } = newNotifications;

  return (
    <div className={styles.notificationList}>
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

export default NotificationPanel;
