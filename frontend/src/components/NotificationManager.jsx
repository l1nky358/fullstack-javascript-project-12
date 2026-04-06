import { useEffect } from 'react';

let notificationTimeout = null;

export const showGlobalNotification = (message, type = 'success') => {
  const existingNotification = document.getElementById('global-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  
  const notification = document.createElement('div');
  notification.id = 'global-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 99999;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(notification);
  
  notificationTimeout = setTimeout(() => {
    const notif = document.getElementById('global-notification');
    if (notif) notif.remove();
  }, 3000);
};

const NotificationManager = () => {
  useEffect(() => {
    return () => {
      const notification = document.getElementById('global-notification');
      if (notification) notification.remove();
      if (notificationTimeout) clearTimeout(notificationTimeout);
    };
  }, []);
  
  return null;
};

export default NotificationManager;
