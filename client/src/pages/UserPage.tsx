import React, { useEffect, useState } from 'react';
import { NavBar, Card } from '../components';
import { useParams } from 'react-router-dom';
import userService from '../services/UserService';
import { IUser } from '../models/IUser';
import { selectUsersArticles } from '../slices/articlesSlice';
import { useAppSelector, useAppDispatch } from '../hooks';

export const UserPage: React.FC = () => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const { userId } = useParams();

  const dispatch = useAppDispatch();
  const userArticles = useAppSelector((state) => selectUsersArticles(state, user._id));

  useEffect(() => {
    async function fetchUserById() {
      try {
        const response = await userService.fetchUser(userId);
        setUser(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchUserById();
  }, [userId, dispatch]);

  const renderedArticles = () => {
    return userArticles.map((article) => <Card {...article} />);
  };

  if (!user) {
    return (
      <section>
        <h2 className="text-light">User not found</h2>
      </section>
    );
  }

  return (
    <div className="wrapper bg-dark">
      <NavBar />
      <div className="container mt-3 text-light">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>{user._id}</p>
        <p>Статьи пользователя</p>
        <div className="container d-flex flex-wrap">
          {userArticles ? renderedArticles() : 'У пользователя нет статей'}
        </div>
      </div>
    </div>
  );
};
