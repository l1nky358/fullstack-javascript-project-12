import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from './api';
import { useAuth } from './AuthContext';
import { showError, showSuccess } from './Toast';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState('');

  const validationSchema = yup.object({
    username: yup.string().required(t('login.errors.usernameRequired')),
    password: yup.string().required(t('login.errors.passwordRequired')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post('/login', values);
        login(response.data.token, values.username);
        showSuccess(t('toast.loginSuccess'));
        navigate('/');
      } catch (error) {
        if (error.response?.status === 401) {
          setAuthError(t('login.errors.invalidCredentials'));
          showError(t('login.errors.invalidCredentials'));
        } else {
          setAuthError(t('login.errors.serverError'));
          showError(t('login.errors.serverError'));
        }
      } finally {
        setSubmitting(false);
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
        
        {authError && (
          <div className="auth-error">
            {authError}
          </div>
        )}
        
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
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
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