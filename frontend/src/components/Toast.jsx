import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  console.log('Error blocked:', message);
};

export const showWarning = (message) => {
  toast.warning(message);
};

export const showInfo = (message) => {
  toast.info(message);
};
