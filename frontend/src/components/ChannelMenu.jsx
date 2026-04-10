import { useState } from 'react'

const ChannelMenu = ({ channel, onRename, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false)
  const isGeneral = channel.name === 'general'
  const isRandom = channel.name === 'random'
  // Не показываем меню для system каналов
  if (isGeneral || isRandom) {
    return null
  }

  return (
    <div style={{ position: 'relative', marginLeft: '8px' }}>
      <button
        className="btn btn-sm btn-link"
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Управление каналом"
      >
        Управление каналом
      </button>
      {showMenu && (
        <>
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: 1000,
              minWidth: '150px',
            }}
          >
            <button
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 16px',
                textAlign: 'left',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
              onClick={() => {
                setShowMenu(false)
                onRename()
              }}
            >
              Переименовать
            </button>
            <button
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 16px',
                textAlign: 'left',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'red',
              }}
              onClick={() => {
                setShowMenu(false)
                onRemove()
              }}
            >
              Удалить
            </button>
          </div>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={() => setShowMenu(false)}
          />
        </>
      )}
    </div>
  )
}

export default ChannelMenu
