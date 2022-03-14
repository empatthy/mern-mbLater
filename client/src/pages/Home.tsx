import React, { useEffect, useState } from 'react';

import { NavBar } from '../components/NavBar';
import { Card } from '../components/Card';
import { useHttp } from '../hooks/http.hook';

export const Home: React.FC = () => {
  const { request, loading } = useHttp();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const items = await request('api/article/get', 'GET');
        setArticles(items);
      } catch (e) {
        console.error(e, 'Ошибка при запросе статей');
      }
    }
    fetchArticles();
  }, [request]);

  const renderArticles = () => {
    return articles.map((item: any, index: number) => <Card key={index} {...item} />);
  };

  return (
    <div className="wrapper bg-dark">
      <NavBar />
      <div className="container mt-3">
        <div className="container d-flex flex-wrap">{!loading && articles && renderArticles()}</div>
      </div>
    </div>
  );
};
