import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectIsAuth, logout } from '../slices/authSlice';

export const UserDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
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

  const logoutHandle = () => {
    dispatch(logout());
  };

  useEffect(() => {
    document.body.addEventListener('click', outsideClickHandle);
  }, []);

  return (
    <div className="user-wrapper" ref={dropdownRef}>
      <img onClick={dropdownToggle} className="mt-1 ms-3" src="/img/user.svg" alt="User" />
      <CSSTransition
        in={dropdownIsOpen}
        timeout={300}
        classNames="user-dropdown"
        unmountOnExit
        onEnter={() => setDropdownIsOpen(true)}
        onExited={() => setDropdownIsOpen(false)}>
        <div className="user-dropdown bg-gray border border-secondary">
          <ul className="dropdown-menu-dark px-1 my-1">
            {isAuth ? (
              <>
                <li className="dropdown-item text-light">Мой профиль</li>
                <Link className="text-decoration-none" to="/add">
                  <li className="dropdown-item text-light">Создать статью</li>
                </Link>
              </>
            ) : (
              <Link className="text-decoration-none" to="/auth">
                <li className="dropdown-item text-light">Вход</li>
              </Link>
            )}
            <li className="dropdown-item text-light">Настройки</li>
            {isAuth && (
              <>
                <hr className="dropdown-divider my-1" />
                <li onClick={logoutHandle} className="dropdown-item text-light">
                  Выход
                </li>
              </>
            )}
          </ul>
        </div>
      </CSSTransition>
    </div>
  );
};
