import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fredoka';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import App from './App';
import { initPwaUpdates } from './lib/pwa';
import { AppProvider } from './state/AppContext';

initPwaUpdates();

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

createRoot(container).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
