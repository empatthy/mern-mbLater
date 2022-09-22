import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { selectIsAuth } from '../../redux/slices/authSlice';

import { UserDropdown } from '..';
import { NotificationsDropdown } from '..';

import styles from './nav-bar.module.scss';

export const NavBar: React.FC = () => {
  const isAuth = useAppSelector(selectIsAuth);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gray">
      <div className="container">
        <Link to="/articles" className="navbar-brand">
          mbLater
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <form className="d-flex">
            {/* <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            /> */}
            {isAuth && <NotificationsDropdown />}
            {isAuth ? (
              <UserDropdown />
            ) : (
              <>
                <Link to="/login">
                  <button className={styles.login}>Войти</button>
                </Link>
                <Link to="/signup">
                  <button className={styles.signup}>Зарегистрироваться</button>
                </Link>
              </>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
