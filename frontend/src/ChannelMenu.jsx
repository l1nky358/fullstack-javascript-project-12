import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChannelMenu = ({ channel, onRename, onRemove }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  if (channel.removable === false) {
    return null;
  }

  return (
    <div className="dropdown d-inline">
      <button
        className="btn btn-sm btn-link dropdown-toggle"
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        aria-label={t('channelMenu')}
      >
        ⋮
      </button>
      
      {showMenu && (
        <div className="dropdown-menu show">
          <button
            className="dropdown-item"
            onClick={() => {
              setShowMenu(false);
              onRename();
            }}
          >
            {t('channels.menu.rename')}
          </button>
          <button
            className="dropdown-item text-danger"
            onClick={() => {
              setShowMenu(false);
              onRemove();
            }}
          >
            {t('channels.menu.remove')}
          </button>
        </div>
      )}
      
      {showMenu && (
        <div
          className="dropdown-backdrop"
          style={{ position: 'fixed', inset: 0, zIndex: 1040 }}
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ChannelMenu;