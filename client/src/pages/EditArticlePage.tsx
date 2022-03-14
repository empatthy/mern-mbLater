import React, { useContext, useState } from 'react';

import { useHttp } from '../hooks/http.hook';
import { NavBar } from '../components/NavBar';
import { AuthContext } from '../context/AuthContext';

export const EditArticlePage: React.FC = (props) => {
  const { request, loading } = useHttp();
  const { token, userId } = useContext(AuthContext);

  const [form, setFrom] = useState({
    title: 'Бебра понюхана',
    description: 'Бебра понюхана, спешите видеть',
    body: 'Я падла ёбаная',
    author: userId,
    date: new Date().toUTCString(),
  });

  console.log('from ', form);

  const addingArticleHandler = async () => {
    try {
      setFrom({ ...form, author: userId });
      await request(
        '/api/article/add',
        'POST',
        {
          ...form,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );
    } catch (e) {}
  };

  return (
    <div className="wrapper bg-dark">
      <NavBar />
      <button onClick={addingArticleHandler} className="btn btn-success">
        Опубликовать
      </button>
    </div>
  );
};
