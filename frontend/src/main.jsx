import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import store from './store';
import i18n from './locales/i18n';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

// ФИЛЬТР ДУБЛИКАТОВ ОШИБОК
setInterval(() => {
  const errorText = 'Неверные имя пользователя или пароль';
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (node.textContent === errorText) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );
  
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  
  if (textNodes.length > 1) {
    for (let i = 1; i < textNodes.length; i++) {
      const parent = textNodes[i].parentNode;
      if (parent) {
        parent.removeChild(textNodes[i]);
      }
    }
  }
}, 100);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary
      fallbackUI={() => (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Oops, something went wrong.</h2>
          <p>We've been notified and are looking into it.</p>
        </div>
      )}
    >
      <ReduxProvider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </ReduxProvider>
    </ErrorBoundary>
  </RollbarProvider>
);
