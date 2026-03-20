import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from './api';
import { showError, showSuccess } from './Toast';
import { useAuth } from './AuthContext';

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
        const response = await api.post('/login', {
          username: values.username,
          password: values.password,
        });
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">{t('login.title')}</h2>
              
              {authError && (
                <div className="alert alert-danger">{authError}</div>
              )}
              
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('login.username')}
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                    id="username"
                    name="username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="invalid-feedback">{formik.errors.username}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('login.password')}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? '...' : t('login.submit')}
                </button>
              </form>
              
              <div className="text-center mt-3">
                {t('login.noAccount')}{' '}
                <Link to="/signup">{t('login.signup')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
