import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { login, registration, LoginPayload, RegistrationPayload } from '../slices/authSlice';

export const AuthPage: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const [authToggle, setAuthToggle] = useState(true);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const loginPayload: LoginPayload = {
    email: email,
    password: password,
  };

  const registrationPayload: RegistrationPayload = {
    name: name,
    email: email,
    password: password,
  };

  const registerHandler = async () => {
    dispatch(registration(registrationPayload));
  };

  const loginHandler = async () => {
    dispatch(login(loginPayload));
  };

  return (
    <div className="auth-wrapper bg-dark">
      <div className="auth-container bg-dark">
        <div className="auth-content bg-gray border border-secondary">
          <div className="signin-options text-light mb-5">
            <div onClick={() => setAuthToggle(true)} className="signin-option">
              <div className={authToggle ? 'login-label' : 'login-label-unactive'}>ВХОД</div>
              <hr className={authToggle ? 'line-active' : 'line'} />
            </div>
            <div onClick={() => setAuthToggle(false)} className="signin-option">
              <div className={authToggle ? 'signin-label-unactive' : 'signin-label'}>
                РЕГИСТРАЦИЯ
              </div>
              <hr className={authToggle ? 'line' : 'line-active'} />
            </div>
          </div>
          {!authToggle ? (
            <div className="input-block">
              <div className="input-group mb-3">
                <input
                  placeholder="имя"
                  value={name}
                  name="name"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  placeholder="email"
                  value={email}
                  name="email"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  placeholder="пароль"
                  value={password}
                  name="password"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="input-block">
              <div className="input-group mb-3">
                <input
                  placeholder="email"
                  value={email}
                  name="email"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  placeholder="пароль"
                  value={password}
                  name="password"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}
          <button
            onClick={authToggle ? loginHandler : registerHandler}
            type="button"
            className="btn btn-success m-auto">
            {authToggle ? 'Войти' : 'Зарегистрироваться'}
          </button>
          <div>
            <Link className="text-decoration-none" to="/">
              <p className="text-light">Home</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
