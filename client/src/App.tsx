import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAppDispatch, useAppSelector } from './redux/hooks';
import { checkAuth, selectIsAuth, selectIsLoading, selectUserId } from './redux/slices/authSlice';
import { getAllReactions } from './redux/slices/reactionsSlice';
import { Login, Signup, Home, AddArticlePage, ArticlePage, UserPage } from './pages';
import { Loader } from './components';

import { getNotifications } from './redux/slices/notificationsSlice';
import { Socket } from 'socket.io-client';
import { SocketContext } from './socket/socket-context';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const isLoading = useAppSelector(selectIsLoading);
  const authUserId = useAppSelector(selectUserId);
  const [socket, setSocket] = useState<Socket>();
  console.log('socket-state', socket);

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
    dispatch(getAllReactions());
  }, []);

  useEffect(() => {
    if (isAuth && socket && socket !== ({} as Socket)) {
      socket.on('connect', () => {
        setSocketIsConnected(true);
        console.log('socketIsConnected', socketIsConnected);
        console.log('socket.id', socket.id);
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
            <Route path="/articles" element={<Home />} />
            <Route path="/add" element={<AddArticlePage />} />
            <Route path="/articles/:articleId" element={<ArticlePage />} />
            <Route path="/articles/:articleId/edit" element={<AddArticlePage />} />
            <Route path="/users/:userId" element={<UserPage />} />
            <Route path="*" element={<Navigate to="/articles" />} />
          </Routes>
        </SocketContext.Provider>
      ) : (
        <Routes>
          <Route path="/articles" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/articles/:articleId" element={<ArticlePage />} />
          <Route path="/users/:userId" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/articles" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
