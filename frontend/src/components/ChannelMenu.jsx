import { useState } from 'react';

const ChannelMenu = ({ channel, onRename, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const isGeneral = channel.name === 'general';

  return (
    <>
      <button
        className="btn btn-sm btn-link text-secondary"
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Управление каналом"
      >
        Управление каналом
      </button>
      
      {showMenu && (
        <>
          <div
            className="dropdown-menu show"
            style={{ position: 'absolute', right: 0, zIndex: 1050 }}
          >
            <button
              className="dropdown-item"
              onClick={() => {
                setShowMenu(false);
                onRename();
              }}
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
    </>
  );
};

export default ChannelMenu;
