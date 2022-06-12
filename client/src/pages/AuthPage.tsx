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
        <div className="auth-content bg-gray border-all border-gray">
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
                <div className="col-md">
                  <div className="form-floating">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="form-control"
                      id="floatingInputGridName"
                    />
                    <label>Name</label>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <div className="col-md">
                  <div className="form-floating">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="form-control"
                      id="floatingInputGridEmail"
                    />
                    <label>Email address</label>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <div className="col-md">
                  <div className="form-floating">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className="form-control"
                      id="floatingInputGridPassword"
                    />
                    <label>Password</label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="input-block">
              <div className="input-group mb-3">
                <div className="col-md">
                  <div className="form-floating">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="form-control"
                      id="floatingInputGridEmail"
                    />
                    <label>Email address</label>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <div className="col-md">
                  <div className="form-floating">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className="form-control"
                      id="floatingInputGridPassword"
                    />
                    <label>Password</label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={authToggle ? loginHandler : registerHandler}
            type="button"
            className="btn btn-success m-auto">
            {authToggle ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </div>
      </div>
    </div>
  );
};
