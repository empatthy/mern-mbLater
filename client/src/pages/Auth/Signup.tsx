import React, { useState, useContext } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import {
  login,
  registration,
  LoginPayload,
  RegistrationPayload,
} from '../../redux/slices/authSlice';
import { SocketContext } from '../../socket/socket-context';
import { NavBar } from '../../components';

import styles from './auth.module.scss';

export const Signup: React.FC = () => {
  const dispatch = useAppDispatch();
  const socketContext = useContext(SocketContext);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const registrationPayload: RegistrationPayload = {
    name: name,
    email: email,
    password: password,
  };

  const registerHandler = async () => {
    dispatch(registration(registrationPayload));
  };

  return (
    <div className="wrapper">
      <NavBar />
      <div className={styles.authWrapper}>
        <div className={styles.authContainer}>
          <div className={styles.authContent}>
            <p>регистрация</p>
            <div className={styles.inputBlock}>
              <div className={styles.inputGroup}>
                <form autoComplete="off">
                  <input
                    autoComplete="off"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                  />
                </form>
              </div>
              <div className={styles.inputGroup}>
                <form autoComplete="off">
                  <input
                    autoComplete="off"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </form>
              </div>
              <div className={styles.inputGroup}>
                <form autoComplete="off">
                  <input
                    autoComplete="off"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </form>
              </div>
            </div>
            <button onClick={registerHandler} disabled={!name || !email || !password} type="submit">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
