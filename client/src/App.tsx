import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAppDispatch, useAppSelector } from './hooks';
import { checkAuth, selectIsAuth, selectIsLoading } from './slices/authSlice';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { EditArticlePage } from './pages/EditArticlePage';
import { AddArticlePage } from './pages/AddArticlePage';
import { Loader } from './components/Loader';

function App() {
  const dispath = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispath(checkAuth());
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      {isAuth ? (
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<AuthPage />} path="/auth" />
          <Route element={<EditArticlePage />} path="/edit" />
          <Route element={<AddArticlePage />} path="/add" />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<AuthPage />} path="/auth" />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
