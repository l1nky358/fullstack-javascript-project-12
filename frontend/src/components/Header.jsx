import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t } = useTranslation();
  const { token, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 m-0">{t('header.title')}</h1>
        {token && (
          <div>
            <span className="me-3">{username}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              {t('header.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;