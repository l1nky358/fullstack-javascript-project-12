import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { removeChannel } from '../slices/channelsSlice';
import { showSuccess, showError } from '../Toast';

const RemoveChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const handleRemove = async () => {
    setSubmitting(true);
    try {
      await dispatch(removeChannel(channel.id)).unwrap();
      showSuccess(t('toast.channelRemoved'));
      onClose();
    } catch (error) {
      showError(t('channels.modals.remove.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t('channels.modals.remove.title', { name: channel.name })}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          
          <div className="modal-body">
            <p className="mb-2">{t('channels.modals.remove.confirm')}</p>
            <p className="text-danger mb-0">{t('channels.modals.remove.warning')}</p>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('channels.modals.remove.cancel')}
            </button>
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={handleRemove}
              disabled={submitting}
            >
              {submitting ? t('channels.modals.remove.submitting') : t('channels.modals.remove.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveChannelModal;