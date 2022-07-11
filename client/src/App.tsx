import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAppDispatch, useAppSelector } from './hooks';
import { checkAuth, selectIsAuth, selectIsLoading, selectUserId } from './slices/authSlice';
import { getAllReactions } from './slices/reactionsSlice';
import { AuthPage, Home, EditArticlePage, AddArticlePage, ArticlePage, UserPage } from './pages';
import { Loader } from './components';
import { fetchArticles } from './slices/articlesSlice';
import { getNotifications } from './slices/notificationsSlice';
import { Socket } from 'socket.io-client';
import { SocketContext } from './socket/socket-context';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const isLoading = useAppSelector(selectIsLoading);
  const authUserId = useAppSelector(selectUserId);
  const [socket, setSocket] = useState<Socket>();
  console.log('state', socket);

  useEffect(() => {
    if (isAuth) {
      import('./socket/socket').then(({ socket }) => {
        setSocket(socket);
        socket.connect();
      });
    }
  }, [isAuth]);

  const [socketIsConnected, setSocketIsConnected] = useState(socket?.connected);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, []);

  useEffect(() => {
    dispatch(fetchArticles());
  }, []);

  useEffect(() => {
    dispatch(getAllReactions());
  }, []);

  useEffect(() => {
    if (isAuth && socket && socket !== ({} as Socket)) {
      socket.on('connect', () => {
        setSocketIsConnected(true);
        console.log(socketIsConnected);
        console.log(socket.id);
      });

      socket.on('disconnect', () => {
        setSocketIsConnected(socket.connected);
        console.log(socket);
      });
    }
  }, [socket, isAuth]);

  useEffect(() => {
    if (isAuth && socketIsConnected) {
      socket?.emit('addUser', authUserId);
    }
  }, [socketIsConnected, isAuth]);

  useEffect(() => {
    socket?.on('getNotification', (data) => {
      console.log(data);
      dispatch(getNotifications(authUserId));
    });
  }, [socket]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      {isAuth && socket ? (
        <SocketContext.Provider value={{ socket, setSocket }}>
          <Routes>
            <Route element={<Home />} path="/articles" />
            <Route element={<EditArticlePage />} path="/edit" />
            <Route element={<AddArticlePage />} path="/add" />
            <Route element={<ArticlePage />} path="/articles/:articleId" />
            <Route element={<UserPage />} path="/users/:userId" />
            <Route path="*" element={<Navigate to="/articles" />} />
          </Routes>
        </SocketContext.Provider>
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
