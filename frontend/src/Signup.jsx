import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from './api';
import { showError, showSuccess } from './Toast';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const validationSchema = yup.object({
    username: yup
      .string()
      .min(3, t('signup.errors.usernameMinMax'))
      .max(20, t('signup.errors.usernameMinMax'))
      .required(t('signup.errors.usernameRequired')),
    password: yup
      .string()
      .min(6, t('signup.errors.passwordMin'))
      .required(t('signup.errors.passwordRequired')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('signup.errors.passwordsMustMatch'))
      .required(t('signup.errors.confirmRequired')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post('/signup', {
          username: values.username,
          password: values.password,
        });
        
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', values.username);
        
        showSuccess(t('toast.signupSuccess'));
        
        window.location.href = '/';
        
      }
      catch (error) {
        if (error.response?.status === 409) {
          setAuthError(t('signup.errors.userExists'));
          showError(t('signup.errors.userExists'));
        }
        else {
          setAuthError(t('signup.errors.serverError'));
          showError(t('signup.errors.serverError'));
        }
      }
      finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('signup.title')}</h2>
          <p>Создайте новый аккаунт</p>
        </div>
        
        {authError && (
          <div className="auth-error">
            {authError}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              {t('signup.username')}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                placeholder={t('signup.placeholders.username')}
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
              {t('signup.password')}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder={t('signup.placeholders.password')}
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">
              {t('signup.confirmPassword')}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">✓</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder={t('signup.placeholders.confirm')}
                className={`form-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="error-message">{formik.errors.confirmPassword}</div>
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
              t('signup.submit')
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          {t('signup.haveAccount')}{' '}
          <Link to="/login" className="auth-link">
            {t('signup.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
