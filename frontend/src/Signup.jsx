import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from './api';
import { showError, showSuccess } from './Toast';
import { useAuth } from './AuthContext';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
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
        login(response.data.token, values.username);
        showSuccess(t('toast.signupSuccess'));
        navigate('/');
      } catch (error) {
        if (error.response?.status === 409) {
          setAuthError(t('signup.errors.userExists'));
          showError(t('signup.errors.userExists'));
        } else {
          setAuthError(t('signup.errors.serverError'));
          showError(t('signup.errors.serverError'));
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
              <h2 className="text-center mb-4">{t('signup.title')}</h2>
              
              {authError && (
                <div className="alert alert-danger">{authError}</div>
              )}
              
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('signup.username')}
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
                    {t('signup.password')}
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
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t('signup.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? '...' : t('signup.submit')}
                </button>
              </form>
              
              <div className="text-center mt-3">
                {t('signup.haveAccount')}{' '}
                <Link to="/login">{t('signup.login')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
