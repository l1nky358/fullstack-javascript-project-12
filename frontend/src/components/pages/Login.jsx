import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useLoginMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [authError, setAuthError] = useState('');
  const isSubmittingRef = useRef(false);

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
    onSubmit: async (values) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      
      setAuthError('');
      
      try {
        const response = await loginMutation({
          username: values.username,
          password: values.password,
        }).unwrap();
        
        login(response.token, values.username);
        navigate('/');
      } catch (error) {
        setAuthError(t('login.errors.invalidCredentials'));
      } finally {
        isSubmittingRef.current = false;
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('login.title')}</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
        
        {authError && (
          <div className="auth-error" key="login-error-message">
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
                placeholder={t('login.placeholders.username')}
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
                placeholder={t('login.placeholders.password')}
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
