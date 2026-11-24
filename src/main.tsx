import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource-variable/fredoka';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import App from './App';
import { AppProvider } from './state/AppContext';

registerSW({ immediate: true });

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

createRoot(container).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
