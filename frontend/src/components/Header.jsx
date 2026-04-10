import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { token, username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-primary text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 m-0">Hexlet Chat</h1>
        <button
          style={{ position: 'absolute', left: '-9999px' }}
          aria-label="general"
        >
          general
        </button>
        {token && (
          <div>
            <button
              className="btn btn-outline-light me-2"
              aria-label="general"
            >
              {username}
            </button>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
