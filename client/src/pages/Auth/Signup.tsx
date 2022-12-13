import React, { useState, useContext, useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { registration, RegistrationPayload } from '../../redux/slices/authSlice';
import { NavBar } from '../../components';

import styles from './auth.module.scss';

export const Signup: React.FC = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [nameDirty, setNameDirty] = useState(false);
  const [emailDirty, setEmailDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);

  const [nameError, setNameError] = useState<string>('Имя не может быть пустым');
  const [emailError, setEmailError] = useState<string>('Email не может быть пустым');
  const [passwordError, setPasswordError] = useState<string>('Пароль не может быть пустым');
  const [formValid, setFormValid] = useState(false);

  const registrationPayload: RegistrationPayload = {
    name: name,
    email: email,
    password: password,
  };

  const registerHandler = async () => {
    dispatch(registration(registrationPayload));
  };

  const blurHandler = (e: any) => {
    switch (e.target.name) {
      case 'Name':
        setNameDirty(true);
        break;
      case 'Email':
        setEmailDirty(true);
        break;
      case 'Password':
        setPasswordDirty(true);
        break;
    }
  };

  const nameHandler = (e: any) => {
    setName(e.target.value);
    if (!e.target.value) {
      setNameError('Имя не может быть пустым');
    } else {
      setNameError('');
    }
  };

  const emailHandler = (e: any) => {
    setEmail(e.target.value);
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(e.target.value).toLowerCase())) {
      setEmailError('Некорректный email');
      if (!e.target.value) {
        setEmailError('Email не может быть пустым');
      }
    } else {
      setEmailError('');
    }
  };

  const passwordHandler = (e: any) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6 || e.target.value.length > 16) {
      setPasswordError('Пароль должен быть длиннее 6 и короче 16 символов');
      if (!e.target.value) {
        setPasswordError('Пароль не может быть пустым');
      }
    } else {
      setPasswordError('');
    }
  };

  useEffect(() => {
    if (nameError || emailError || passwordError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [nameError, emailError, passwordError]);

  return (
    <div className="wrapper">
      <NavBar />
      <div className={styles.authWrapper}>
        <div className={styles.authContainer}>
          <div className={styles.authContent}>
            <p>регистрация</p>
            <div className={styles.inputBlock}>
              <div className={nameDirty && nameError ? styles.inputGroupError : styles.inputGroup}>
                <form autoComplete="off">
                  <input
                    onBlur={blurHandler}
                    name="Name"
                    autoComplete="off"
                    placeholder="Имя"
                    value={name}
                    onChange={nameHandler}
                    type="text"
                  />
                  {nameDirty && nameError && <p>{nameError}</p>}
                </form>
              </div>
              <div
                className={emailDirty && emailError ? styles.inputGroupError : styles.inputGroup}>
                <form autoComplete="off">
                  <input
                    onBlur={blurHandler}
                    name="Email"
                    autoComplete="off"
                    placeholder="Email"
                    value={email}
                    onChange={emailHandler}
                    type="email"
                  />
                  {emailDirty && emailError && <p>{emailError}</p>}
                </form>
              </div>
              <div
                className={
                  passwordDirty && passwordError ? styles.inputGroupError : styles.inputGroup
                }>
                <form autoComplete="off">
                  <input
                    onBlur={blurHandler}
                    name="Password"
                    autoComplete="off"
                    placeholder="Пароль"
                    value={password}
                    onChange={passwordHandler}
                    type="password"
                  />
                  {passwordDirty && passwordError && <p>{passwordError}</p>}
                </form>
              </div>
            </div>
            <button onClick={registerHandler} disabled={!formValid} type="submit">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
