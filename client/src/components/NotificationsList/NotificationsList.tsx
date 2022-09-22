import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUserId } from '../../redux/slices/authSlice';
import { allNotificationsRead, selectNotifications } from '../../redux/slices/notificationsSlice';
import { TimeAgo } from '../';

import styles from './notifications-list.module.scss';

export const NotificationsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUserId = useAppSelector(selectUserId);

  const notifications = useAppSelector(selectNotifications);
  const numUnreadNotifications = notifications.filter((item) => !item.read).length;

  const renderedNotifications = () => {
    return notifications.map((notification, index) => (
      <li key={index} className={notification.new ? styles.notificationNew : styles.notification}>
        {notification.sender.name}{' '}
        {notification.notificationType === 0
          ? 'оценил ваш комментарий'
          : 'ответил на ваш комментарий'}
        <TimeAgo date={notification.date} />
      </li>
    ));
  };

  useEffect(() => {
    return () => {
      if (numUnreadNotifications > 0) {
        dispatch(allNotificationsRead(authUserId));
      }
    };
  }, []);

  return <div className={styles.wrapper}>{renderedNotifications()}</div>;
};
