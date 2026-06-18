import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './i18n';           // initialize i18next before first render
import './styles.css';     // themes + globals + animations
import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
