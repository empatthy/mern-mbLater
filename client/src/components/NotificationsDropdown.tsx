import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getNotifications, selectNotifications } from '../slices/notificationsSlice';
import { selectUserId } from '../slices/authSlice';
import { NotificationsList } from '../components/NotificationsList';
import notificationsIcon from '../img/notifications-button.svg';
import notificationsIconActive from '../img/notifications-button-active.svg';

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
    <div className="navbar-button-wrapper mt-1 me-3" ref={dropdownRef}>
      <img
        onClick={dropdownToggle}
        className="cursor-p"
        src={dropdownIsOpen ? notificationsIconActive : notificationsIcon}
        alt="Notifications"
      />
      {numUnreadNotifications > 0 && (
        <div className="counter text-light fw-bolder">{numUnreadNotifications}</div>
      )}
      <CSSTransition
        in={dropdownIsOpen}
        timeout={300}
        classNames="notifications-dropdown"
        unmountOnExit
        onEnter={() => setDropdownIsOpen(true)}
        onExited={() => setDropdownIsOpen(false)}>
        <ul className="dropdown-menu-dark px-0 mb-0 notifications-dropdown border-all border-gray">
          <div className="text-light ms-3 my-2 notifications-label">Уведомления</div>
          <hr className="dropdown-divider my-1" />
          <NotificationsList />
        </ul>
      </CSSTransition>
    </div>
  );
};
