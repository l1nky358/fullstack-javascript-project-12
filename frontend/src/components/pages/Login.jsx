import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('login.title')}</h2>
          <p>Добро пожаловать обратно!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">{t('login.username')}</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Введите ваш ник"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('login.password')}</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Введите пароль"
                className="form-input"
              />
            </div>
          </div>
          
          <button type="submit" className="auth-button">
            {t('login.submit')}
          </button>
        </form>
        
        <div className="auth-footer">
          {t('login.noAccount')}{' '}
          <Link to="/signup" className="auth-link">
            {t('login.signup')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
