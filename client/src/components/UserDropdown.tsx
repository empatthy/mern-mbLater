import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectIsAuth, logout, selectUserName } from '../slices/authSlice';
import { SocketContext } from '../socket/socket-context';
import userIcon from '../img/user.svg';

export const UserDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const userName = useAppSelector(selectUserName);
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
    <div className="navbar-button-wrapper mt-1 ms-3" ref={dropdownRef}>
      <img onClick={dropdownToggle} className="cursor-p" src={userIcon} alt="User" />
      <CSSTransition
        in={dropdownIsOpen}
        timeout={300}
        classNames="user-dropdown"
        unmountOnExit
        onEnter={() => setDropdownIsOpen(true)}
        onExited={() => setDropdownIsOpen(false)}>
        <ul className="dropdown-menu-dark px-0 mb-0 user-dropdown border-all border-gray">
          {isAuth ? (
            <>
              <div className="border-bot border-gray-lighten">
                <p className="text-light mb-2 ms-3 pt-1">{userName}</p>
              </div>
              <li className="dropdown-item text-light fw-lighter mt-1 cursor-p">Мой профиль</li>
              <Link className="text-decoration-none" to="/add">
                <li className="dropdown-item text-light fw-light">Создать статью</li>
              </Link>
            </>
          ) : (
            <Link className="text-decoration-none" to="/auth">
              <li className="dropdown-item text-light fw-light">Вход</li>
            </Link>
          )}
          <li className="dropdown-item text-light fw-light">Настройки</li>
          {isAuth && (
            <>
              <hr className="dropdown-divider my-1" />
              <li
                onClick={logoutHandle}
                className="dropdown-item text-light fw-light cursor-p mb-1">
                Выход
              </li>
            </>
          )}
        </ul>
      </CSSTransition>
    </div>
  );
};
