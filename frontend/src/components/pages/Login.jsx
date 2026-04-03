import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useLoginMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { showError } from '../Toast';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const validationSchema = yup.object({
    username: yup.string().required(t('validation.required')),
    password: yup.string().required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginMutation(values).unwrap();
        login(response.token, values.username);
        navigate('/');
      } catch (error) {
        if (error.status === 401) {
          showError(t('login.errors.invalidCredentials'));
        } else {
          showError(t('login.errors.serverError'));
        }
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('login.title')}</h2>
          <p>Добро пожаловать обратно!</p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              {t('login.username')}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Введите ваш ник"
                className={`form-input ${formik.touched.username && formik.errors.username ? 'error' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <div className="error-message">{formik.errors.username}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {t('login.password')}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Введите пароль"
                className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="error-message">{formik.errors.password}</div>
            )}
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              t('login.submit')
            )}
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
