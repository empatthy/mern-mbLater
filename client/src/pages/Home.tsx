import React, { useEffect } from 'react';

import { NavBar } from '../components/NavBar';
import { Card } from '../components/Card';

import { fetchArticles, selectAllArticles, selectArticlesStatus } from '../slices/articlesSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const articles = useAppSelector(selectAllArticles);
  const articlesStatus = useAppSelector(selectArticlesStatus);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const renderedArticles = () => {
    return articles.map((article) => <Card key={article.id} {...article} />);
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
