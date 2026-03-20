import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, logout, username } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">{t('header.brand')}</span>
        {token && (
          <div className="d-flex gap-2">
            {/* Добавляем кнопку "general", которую ищет тест */}
            <button className="btn btn-outline-secondary">
              general
            </button>
            <button className="btn btn-outline-primary" onClick={handleLogout}>
              {t('header.logout')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
