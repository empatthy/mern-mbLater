import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthContext } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { EditArticlePage } from './pages/EditArticlePage';
import { useAuth } from './hooks/auth.hook';
import { Loader } from './components/Loader';

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthenticated = !!token;

  if (!ready) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userId,
        isAuthenticated,
      }}>
      <BrowserRouter>
        {isAuthenticated ? (
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<EditArticlePage />} path="/edit" />
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
    </AuthContext.Provider>
  );
}

export default App;
