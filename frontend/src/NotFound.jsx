import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="container text-center mt-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">{t('notFound.title')}</h2>
      <p className="lead mb-4">{t('notFound.message')}</p>
      <p className="mb-4">{t('notFound.description')}</p>
      <Link to="/" className="btn btn-primary">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
};

export default NotFound;