import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNotifications, selectNotifications } from '../../redux/slices/notificationsSlice';
import { selectUserId } from '../../redux/slices/authSlice';
import { NotificationsList } from '../NotificationsList/NotificationsList';

import styles from './notifications-dropdown.module.scss';

import notificationsIcon from '../../img/notifications-icon.svg';
import notificationsIconActive from '../../img/notifications-icon-active.svg';
import notificationsPlaceholder from '../../img/bell-grey.svg';
import settingsIcon from '../../img/gear-icon.svg';

export const NotificationsDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUserId = useAppSelector(selectUserId);

  const notifications = useAppSelector(selectNotifications);
  const numUnreadNotifications = notifications.filter((item) => !item.read).length;

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownToggle = () => {
    setDropdownIsOpen(!dropdownIsOpen);
  };

  const outsideClickHandle = (event: Event) => {
    const path = event.composedPath && event.composedPath();
    if (dropdownRef.current && !path.includes(dropdownRef.current)) {
      setDropdownIsOpen(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', outsideClickHandle);
  }, []);

  useEffect(() => {
    dispatch(getNotifications(authUserId));
  }, []);

  return (
    <div className={styles.navbarButtonWrapper} ref={dropdownRef}>
      <img
        onClick={dropdownToggle}
        src={dropdownIsOpen ? notificationsIconActive : notificationsIcon}
        alt="Notifications"
      />
      {numUnreadNotifications > 0 && <div className={styles.counter}>{numUnreadNotifications}</div>}
      <CSSTransition
        in={dropdownIsOpen}
        timeout={300}
        classNames="notificationsDropdown"
        unmountOnExit
        onEnter={() => setDropdownIsOpen(true)}
        onExited={() => setDropdownIsOpen(false)}>
        <ul className={styles.notificationsDropdown}>
          <div className={styles.header}>
            <p>Уведомления</p>
            {/* <img src={settingsIcon} alt="Настройки" /> */}
          </div>
          {notifications.length !== 0 ? (
            <NotificationsList />
          ) : (
            <div className={styles.placeholder}>
              <img src={notificationsPlaceholder} alt="Bell" />
              <p>В этом разделе будут собраны уведомления</p>
            </div>
          )}
        </ul>
      </CSSTransition>
    </div>
  );
};
