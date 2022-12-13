import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectIsAuth, logout, selectUserName, selectUserId } from '../../redux/slices/authSlice';
import { SocketContext } from '../../socket/socket-context';

import userIcon from '../../img/user.svg';
import noAvatarIcon from '../../img/no-avatar.svg';
import personIcon from '../../img/user2.svg';
import editIcon from '../../img/edit-light.svg';
import logOutIcon from '../../img/log-out.svg';

import styles from './user-dropdown.module.scss';

export const UserDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const authUserId = useAppSelector(selectUserId);
  const userName = useAppSelector(selectUserName);
  const avatarUrl = useAppSelector((state) => state.auth.user.avatarUrl);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const socketContext = useContext(SocketContext);

  const dropdownToggle = () => {
    setDropdownIsOpen(!dropdownIsOpen);
  };

  const outsideClickHandle = (event: Event) => {
    const path = event.composedPath && event.composedPath();
    if (dropdownRef.current && !path.includes(dropdownRef.current)) {
      setDropdownIsOpen(false);
    }
  };

  const logoutHandle = () => {
    socketContext.socket?.disconnect();
    socketContext.setSocket(undefined);
    dispatch(logout());
  };

  useEffect(() => {
    document.body.addEventListener('click', outsideClickHandle);
  }, []);

  return (
    <div className={styles.navbarButtonWrapper} ref={dropdownRef}>
      <img
        onClick={dropdownToggle}
        className={styles.userDropdownAvatar}
        src={userIcon}
        alt="User"
      />
      <CSSTransition
        in={dropdownIsOpen}
        timeout={300}
        classNames="userDropdown"
        unmountOnExit
        onEnter={() => setDropdownIsOpen(true)}
        onExited={() => setDropdownIsOpen(false)}>
        <ul className={styles.userDropdown}>
          {isAuth ? (
            <>
              <div className={styles.user}>
                <img
                  className={styles.avatar}
                  src={avatarUrl ? avatarUrl : noAvatarIcon}
                  alt="UserAvatar"
                />
                <p>{userName}</p>
              </div>
              <div className={styles.menuItems}>
                <Link to={`/users/${authUserId}`}>
                  <li>
                    <img src={personIcon} alt="Profile" />
                    Мой профиль
                  </li>
                </Link>
                <Link to="/add">
                  <li>
                    <img src={editIcon} alt="Edit" />
                    Создать статью
                  </li>
                </Link>
                <li onClick={logoutHandle}>
                  <img src={logOutIcon} alt="LogOut" />
                  Выйти
                </li>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <li>Вход</li>
            </Link>
          )}
        </ul>
      </CSSTransition>
    </div>
  );
};
