import { toast } from 'react-toastify';

let errorDiv = null;

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showError = (message) => {
  if (errorDiv) {
    errorDiv.remove();
  }
  
  errorDiv = document.createElement('div');
  errorDiv.textContent = message;
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '20px';
  errorDiv.style.right = '20px';
  errorDiv.style.backgroundColor = '#ef4444';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '12px 20px';
  errorDiv.style.borderRadius = '8px';
  errorDiv.style.zIndex = '9999';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.fontWeight = '500';
  errorDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    if (errorDiv) {
      errorDiv.remove();
      errorDiv = null;
    }
  }, 3000);
};

export const showWarning = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
