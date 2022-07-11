import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectUserId } from '../slices/authSlice';
import { allNotificationsRead, selectNotifications } from '../slices/notificationsSlice';
import { TimeAgo } from './';

export const NotificationsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUserId = useAppSelector(selectUserId);

  const notifications = useAppSelector(selectNotifications);
  const numUnreadNotifications = notifications.filter((item) => !item.read).length;

  const renderedNotifications = () => {
    return notifications.map((notification, index) => (
      <li
        key={index}
        className={`dropdown-item text-light fw-light ${notification.new && 'notification-new'}`}>
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

  return <div className="notifications-list">{renderedNotifications()}</div>;
};
