import { useState } from 'react';

const ChannelMenu = ({ channel, onRename, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const isGeneral = channel.name === 'general';

  return (
    <div style={{ position: 'relative', marginLeft: '8px' }}>
      <button
        className="btn btn-sm btn-link text-secondary"
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        style={{ textDecoration: 'none', padding: '0 4px' }}
      >
        Управление каналом
      </button>
      
      {showMenu && (
        <>
          <div
            className="dropdown-menu show"
            style={{ 
              position: 'absolute', 
              right: 0, 
              top: '100%',
              zIndex: 1050,
              minWidth: '150px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            <button
              className="dropdown-item"
              onClick={() => {
                setShowMenu(false);
                onRename();
              }}
              style={{ display: 'block', width: '100%', padding: '8px 16px', textAlign: 'left' }}
            >
              Переименовать
            </button>
            {!isGeneral && (
              <button
                className="dropdown-item text-danger"
                onClick={() => {
                  setShowMenu(false);
                  onRemove();
                }}
                style={{ display: 'block', width: '100%', padding: '8px 16px', textAlign: 'left', color: 'red' }}
              >
                Удалить
              </button>
            )}
          </div>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 1040 }}
            onClick={() => setShowMenu(false)}
          />
        </>
      )}
    </div>
  );
};

export default ChannelMenu;
