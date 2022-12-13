import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectIsAuth } from '../../redux/slices/authSlice';
import { searchValueChanged } from '../../redux/slices/articlesSlice';

import { UserDropdown } from '..';
import { NotificationsDropdown } from '..';

import addIcon from '../../img/add-cross-icon.svg';

import styles from './nav-bar.module.scss';

export const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();

  const isAuth = useAppSelector(selectIsAuth);
  const searchValue = useAppSelector((state) => state.articles.searchValue);

  const changeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searchValueChanged(event.target.value));
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link to="/articles" className="navbar-brand">
          mbLater
        </Link>

        <div className="searchBlock">
          <input
            className="form-control"
            type="search"
            placeholder="Поиск"
            value={searchValue}
            onChange={changeSearchValue}
          />
          {isAuth && (
            <Link to="/add">
              <button>
                <img src={addIcon} alt="Создать" />
                Создать
              </button>
            </Link>
          )}
        </div>

        <form className="d-flex">
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
    </nav>
  );
};

export default NavBar;
