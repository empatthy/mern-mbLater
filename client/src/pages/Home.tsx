import React from 'react';

import { NavBar, Card } from '../components';

import { selectAllArticles, selectArticlesStatus } from '../slices/articlesSlice';
import { useAppSelector } from '../hooks';

export const Home: React.FC = () => {
  const articles = useAppSelector(selectAllArticles);
  const articlesStatus = useAppSelector(selectArticlesStatus);

  const renderedArticles = () => {
    return articles.map((article, index) => <Card key={index} {...article} />);
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
