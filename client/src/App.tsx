import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAppDispatch, useAppSelector } from './hooks';
import { checkAuth, selectIsAuth, selectIsLoading } from './slices/authSlice';
import { getAllReactions } from './slices/reactionsSlice';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { EditArticlePage } from './pages/EditArticlePage';
import { AddArticlePage } from './pages/AddArticlePage';
import { ArticlePage } from './pages/ArticlePage';
import { UserPage } from './pages/UserPage';
import { Loader } from './components/Loader';
import { fetchArticles } from './slices/articlesSlice';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllReactions());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      {isAuth ? (
        <Routes>
          <Route element={<Home />} path="/articles" />
          <Route element={<EditArticlePage />} path="/edit" />
          <Route element={<AddArticlePage />} path="/add" />
          <Route element={<ArticlePage />} path="/articles/:articleId" />
          <Route element={<UserPage />} path="/users/:userId" />
          <Route path="*" element={<Navigate to="/articles" />} />
        </Routes>
      ) : (
        <Routes>
          <Route element={<Home />} path="/articles" />
          <Route element={<AuthPage />} path="/auth" />
          <Route element={<ArticlePage />} path="/articles/:articleId" />
          <Route element={<UserPage />} path="/users/:userId" />
          <Route path="*" element={<Navigate to="/articles" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
