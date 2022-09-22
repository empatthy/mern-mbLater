import React, { useEffect } from 'react';

import { NavBar, Card } from '../components';
import { fetchArticles } from '../redux/slices/articlesSlice';

import { selectAllArticles, selectArticlesStatus } from '../redux/slices/articlesSlice';
import { useAppSelector, useAppDispatch } from '../redux/hooks';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const articles = useAppSelector(selectAllArticles);
  const articlesStatus = useAppSelector(selectArticlesStatus);

  useEffect(() => {
    dispatch(fetchArticles());
  }, []);

  const renderedArticles = () => {
    return articles.map((article, index) => <Card key={index} {...article} />);
  };

  return (
    <div className="wrapper">
      <NavBar />
      <div className="container mt-3">
        {articlesStatus !== 'loading' && articles && renderedArticles()}
      </div>
    </div>
  );
};
