import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: 'YOUR_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: 'production',
  enabled: process.env.NODE_ENV === 'production',
});

export const logInfo = (rollbar, message, data = {}) => {
  if (rollbar) {
    rollbar.info(message, data);
  }
};

export const logWarning = (rollbar, message, data = {}) => {
  if (rollbar) {
    rollbar.warning(message, data);
  }
};

export const logError = (rollbar, message, data = {}) => {
  if (rollbar) {
    rollbar.error(message, data);
  }
};

export const useRollbar = () => {
  return rollbar;
};

export default rollbar;