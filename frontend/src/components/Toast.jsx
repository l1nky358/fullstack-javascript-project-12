import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  console.log('🔇 Success blocked:', message);
};

export const showError = (message) => {
  console.log('🔇 Error blocked:', message);
};

export const showWarning = (message) => {
  console.log('🔇 Warning blocked:', message);
};

export const showInfo = (message) => {
  console.log('🔇 Info blocked:', message);
};
