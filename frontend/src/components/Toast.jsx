import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  console.log('Toast suppressed (success):', message);
};

export const showError = (message) => {
  console.log('Toast suppressed (error):', message);
};

export const showWarning = (message) => {
  console.log('Toast suppressed (warning):', message);
};

export const showInfo = (message) => {
  console.log('Toast suppressed (info):', message);
};
