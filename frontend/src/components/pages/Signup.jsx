import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSignupMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [signup, { isLoading }] = useSignupMutation();
  const [authError, setAuthError] = useState('');

  const validationSchema = yup.object({
    username: yup
      .string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: yup
      .string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Обязательное поле'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setAuthError('');
      
      try {
        const response = await signup({
          username: values.username,
          password: values.password,
        }).unwrap();
        
        login(response.token, values.username);
        
        setTimeout(() => {
          navigate('/');
        }, 100);
      } catch (error) {
        if (error.status === 409) {
          setAuthError('Такой пользователь уже существует');
        } else {
          setAuthError('Ошибка сервера. Попробуйте позже.');
        }
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Регистрация</h2>
          <p>Создайте новый аккаунт</p>
        </div>
        
        {authError && (
          <div className="auth-error">
            {authError}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="От 3 до 20 символов"
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
            <label htmlFor="password">Пароль</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Не менее 6 символов"
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
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <div className="input-wrapper">
              <span className="input-icon">✓</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Повторите пароль"
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
            disabled={isLoading}
          >
            {isLoading ? <span className="button-loader"></span> : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="auth-footer">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="auth-link">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
