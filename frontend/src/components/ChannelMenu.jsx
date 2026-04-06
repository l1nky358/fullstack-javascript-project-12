import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChannelMenu = ({ channel, onRename, onRemove }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  if (!channel.removable) {
    return null;
  }

  return (
    <>
      <button
        className="btn btn-sm btn-link text-secondary"
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        aria-label={t('channelMenu')}
      >
        ⋮
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
