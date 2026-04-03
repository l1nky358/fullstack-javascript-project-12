import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (isLoading) return;
    
    try {
      const response = await loginMutation({ username, password }).unwrap();
      login(response.token, username);
      navigate('/');
    } catch (err) {
      setAuthError(t('login.errors.invalidCredentials') || 'Неверные имя пользователя или пароль');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('login.title') || 'Вход'}</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
        
        {authError && (
          <div className="auth-error">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              {t('login.username') || 'Имя пользователя'}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('login.placeholders.username') || 'Ваш ник'}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {t('login.password') || 'Пароль'}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.placeholders.password') || 'Пароль'}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              t('login.submit') || 'Войти'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          {t('login.noAccount') || 'Нет аккаунта?'}{' '}
          <Link to="/signup" className="auth-link">
            {t('login.signup') || 'Регистрация'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
