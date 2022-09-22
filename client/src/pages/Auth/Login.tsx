import React, { useState, useContext } from 'react';
import { NavBar } from '../../components';
import { useAppDispatch } from '../../redux/hooks';
import { login, LoginPayload } from '../../redux/slices/authSlice';
import { SocketContext } from '../../socket/socket-context';

import styles from './auth.module.scss';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const socketContext = useContext(SocketContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const loginPayload: LoginPayload = {
    email: email,
    password: password,
  };

  const loginHandler = async () => {
    dispatch(login(loginPayload));
    import('../../socket/socket').then(({ socket }) => {
      socketContext.setSocket(socket);
    });
  };

  return (
    <div className="wrapper">
      <NavBar />
      <div className={styles.authWrapper}>
        <div className={styles.authContainer}>
          <div className={styles.authContent}>
            <p>вход</p>
            <div className={styles.inputBlock}>
              <div className={styles.inputGroup}>
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </div>
            </div>
            <button onClick={loginHandler} disabled={!email || !password} type="submit">
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
