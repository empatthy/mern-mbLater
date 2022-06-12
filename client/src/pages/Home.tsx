import React from 'react';

import { NavBar } from '../components/NavBar';
import { Card } from '../components/Card';

import { selectAllArticles, selectArticlesStatus } from '../slices/articlesSlice';
import { useAppSelector, useAppDispatch } from '../hooks';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const articles = useAppSelector(selectAllArticles);
  const articlesStatus = useAppSelector(selectArticlesStatus);

  const renderedArticles = () => {
    return articles.map((article) => <Card {...article} />);
  };

  return (
    <div className="wrapper bg-dark">
      <NavBar />
      <div className="container mt-3">
        <div className="container d-flex flex-wrap">
          {articlesStatus !== 'loading' && articles && renderedArticles()}
        </div>
      </div>
    </div>
  );
};
