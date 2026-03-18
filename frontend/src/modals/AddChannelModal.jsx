import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addChannel } from '../slices/channelsSlice';
import { showSuccess, showError } from '../Toast';
import { containsProfanity, cleanProfanity } from '../utils/profanity';

const AddChannelModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const inputRef = useRef();

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(3, t('channels.modals.add.errors.minMax'))
      .max(20, t('channels.modals.add.errors.minMax'))
      .required(t('channels.modals.add.errors.required'))
      .matches(/^[a-zA-Z0-9 _-]+$/, t('channels.modals.add.errors.pattern')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      if (containsProfanity(values.name)) {
        const cleanedName = cleanProfanity(values.name);
        values.name = cleanedName;
      }

      try {
        const result = await dispatch(addChannel({ name: values.name.trim() })).unwrap();
        
        if (result) {
          showSuccess(t('toast.channelCreated'));
          resetForm();
          onClose();
        }
      } catch (error) {
        if (error.message?.includes('exists')) {
          setStatus(t('channels.modals.add.errors.exists'));
          showError(t('channels.modals.add.errors.exists'));
        } else {
          setStatus(t('channels.modals.add.errors.serverError'));
          showError(t('toast.error.failedToCreate'));
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t('channels.modals.add.title')}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              {formik.status && (
                <div className="alert alert-danger">{formik.status}</div>
              )}
              
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  {t('channels.modals.add.name')}
                </label>
                <input
                  ref={inputRef}
                  id="name"
                  type="text"
                  className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                {t('channels.modals.add.cancel')}
              </button>
              <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? t('channels.modals.add.submitting') : t('channels.modals.add.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChannelModal;