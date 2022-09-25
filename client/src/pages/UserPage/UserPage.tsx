import React, { useEffect, useRef, useState } from 'react';
import { NavBar, Card, Loader } from '../../components';
import { useParams } from 'react-router-dom';
import userService from '../../services/UserService';
import { IUser } from '../../models/IUser';
import { selectUsersArticles } from '../../redux/slices/articlesSlice';
import {
  selectUserId,
  uploadAvatar,
  UploadAvatarPayload,
  removeAvatar,
} from '../../redux/slices/authSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

import editAvatarIcon from '../../img/edit.svg';
import removeAvatarIcon from '../../img/can.svg';
import userIcon from '../../img/user.svg';

import styles from './user-page.module.scss';

export const UserPage: React.FC = () => {
  const [user, setUser] = useState<IUser>();

  console.log('API_URL', process.env.REACT_APP_API_URL);

  const { userId } = useParams();
  const authUserId = useAppSelector(selectUserId);
  const inputFileRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  const dispatch = useAppDispatch();
  const userArticles = useAppSelector((state) => selectUsersArticles(state, userId));

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await userService.fetchUser(userId);
        setUser(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserById();
  }, [userId, dispatch]);

  const handleChangeFile = async (event: any) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const uploadAvatarPayload: UploadAvatarPayload = {
        userId: authUserId,
        formData,
      };
      dispatch(uploadAvatar(uploadAvatarPayload));
    } catch (e) {
      console.log(e);
    }
  };

  const removeAvatarClick = () => {
    dispatch(removeAvatar(authUserId));
  };

  const renderedArticles = () => {
    return userArticles.map((article, index) => <Card key={index} {...article} />);
  };

  return (
    <div className="wrapper">
      <NavBar />
      {user ? (
        <div className={`${styles.userPageContainer} container`}>
          <div className={styles.user}>
            <div className={styles.info}>
              <div className={styles.avatarBlock}>
                <>
                  <img
                    className={styles.userpageAvatar}
                    src={user.avatarUrl ? process.env.API_URL + user.avatarUrl : userIcon}
                    alt="Avatar"
                  />
                </>
                <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
                {userId === authUserId && (
                  <>
                    <button
                      className={styles.editAvatar}
                      onClick={() => inputFileRef.current.click()}>
                      <img src={editAvatarIcon} alt="Pencil" />
                      {user.avatarUrl ? 'Изменить' : 'Загрузить'}
                    </button>
                    {user.avatarUrl && (
                      <button className={styles.removeAvatar} onClick={removeAvatarClick}>
                        <img src={removeAvatarIcon} alt="Can" />
                        Удалить
                      </button>
                    )}
                  </>
                )}
              </div>
              <p>{user.name}</p>
            </div>
          </div>
          <div className={styles.articlesHeader}>
            <p>Статьи пользователя</p>
          </div>
          <div>{userArticles ? renderedArticles() : 'У пользователя нет статей'}</div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};
