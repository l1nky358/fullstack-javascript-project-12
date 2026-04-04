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
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await loginMutation({ username, password }).unwrap();
      login(response.token, username);
      navigate('/');
    } catch (err) {
      setError(t('login.errors.invalidCredentials'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t('login.title')}</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t('login.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {t('login.submit')}
          </button>
        </form>
        
        <Link to="/signup">{t('login.signup')}</Link>
      </div>
    </div>
  );
};

export default Login;
