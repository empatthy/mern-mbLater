import React, { useEffect, useState } from 'react';

import { NavBar, Card } from '../../components';
import { fetchArticles } from '../../redux/slices/articlesSlice';

import { selectAllArticles, selectArticlesStatus } from '../../redux/slices/articlesSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

import styles from './home-page.module.scss';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const articles = useAppSelector(selectAllArticles);
  const articlesStatus = useAppSelector(selectArticlesStatus);
  const searchValue = useAppSelector((state) => state.articles.searchValue);

  const [filter, setFilter] = useState(false);

  useEffect(() => {
    dispatch(fetchArticles());
  }, []);

  const renderedArticles = () => {
    const filteredArticles = articles.filter((article) =>
      article.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
    return filteredArticles.map((article, index) => <Card key={index} {...article} />);
  };

  return (
    <div className="wrapper">
      <NavBar />
      <div className="container mt-3">
        <div className={styles.tabs}>
          <button onClick={() => setFilter(false)} className={!filter ? styles.buttonActive : ''}>
            Новые
          </button>
          <button onClick={() => setFilter(true)} className={filter ? styles.buttonActive : ''}>
            Популярные
          </button>
        </div>
        {articlesStatus !== 'loading' && articles && renderedArticles()}
      </div>
    </div>
  );
};
