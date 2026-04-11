import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useLoginMutation } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loginMutation, { isLoading }] = useLoginMutation()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object({
      username: yup.string().required('Обязательное поле'),
      password: yup.string().required('Обязательное поле'),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        const response = await loginMutation(values).unwrap()
        login(response.token, values.username)
        navigate('/')
      }
      catch {
        setFieldError('username', 'Неверные имя пользователя или пароль')
        setFieldError('password', ' ')
      }
    },
  })

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Вход в чат</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Ваш ник</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                {...formik.getFieldProps('username')}
                className={`form-input ${formik.touched.username && formik.errors.username ? 'error' : ''}`}
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
                {...formik.getFieldProps('password')}
                className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="error-message">{formik.errors.password}</div>
            )}
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? <span className="button-loader"></span> : 'Войти'}
          </button>
        </form>
        <div className="auth-footer">
          Нет аккаунта?
          {' '}
          <Link to="/signup" className="auth-link">
            Регистрация
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
