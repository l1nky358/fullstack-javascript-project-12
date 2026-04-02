import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setAuthError('');
  }, []);

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
      setAuthError('');
      
      try {
        const response = await loginMutation(values).unwrap();
        login(response.token, values.username);
        navigate('/');
      } catch (error) {
        if (error.status === 401) {
          setAuthError(t('login.errors.invalidCredentials'));
        } else {
          setAuthError(t('login.errors.serverError'));
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
        
        {/* Только один блок ошибки */}
        <form onSubmit={formik.handleSubmit} className="auth-form">
          {/* ... остальной код формы без изменений ... */}
        </form>
      </div>
    </div>
  );
};
