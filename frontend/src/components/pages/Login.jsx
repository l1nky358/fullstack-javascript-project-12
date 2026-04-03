import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const [login, { isLoading }] = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ username, password }).unwrap();
      logIn(data);
      navigate('/');
    } catch (err) {
      setError(t('login.errors.invalidCredentials'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={t('login.username')}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('login.password')}
      />
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {t('login.submit')}
      </button>
      <Link to="/signup">{t('login.signup')}</Link>
    </form>
  );
};

export default Login
