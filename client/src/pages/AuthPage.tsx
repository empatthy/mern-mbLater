import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const AuthPage: React.FC = (props) => {
  const navigate = useNavigate();
  const { loading, request } = useHttp();
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const [authToggle, setAuthToggle] = useState(true);

  const [form, serForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const changeHandler = (event: any) => {
    serForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      await request('/api/auth/register', 'POST', {
        ...form,
        isAdmin: false,
        isEditor: false,
      });
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      login(data.token, data.userId);
    } catch (e) {}
  };

  const logoutHandle = (event: any) => {
    event.preventDefault();
    logout();
    navigate('/');
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
                  name="name"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={changeHandler}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  placeholder="email"
                  name="email"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={changeHandler}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  placeholder="пароль"
                  name="password"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={changeHandler}
                />
              </div>
            </div>
          ) : (
            <div className="input-block">
              <div className="input-group mb-3">
                <input
                  placeholder="email"
                  name="email"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={changeHandler}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  placeholder="пароль"
                  name="password"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={changeHandler}
                />
              </div>
            </div>
          )}
          <button
            onClick={authToggle ? loginHandler : registerHandler}
            disabled={loading}
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
