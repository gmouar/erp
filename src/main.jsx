import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { app, auth, db } from './config/firebase';
import './index.css';

async function initApp() {
  try {
    // Wait for Firebase core services to initialize
    await Promise.all([
      auth._initializationPromise,
      db._initializationPromise
    ]);

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Application initialization failed:', error);
    // Show user-friendly error message
    document.getElementById('root').innerHTML = `
      <div style="color: red; padding: 20px;">
        Unable to initialize application. Please try again later.
      </div>
    `;
  }
}

initApp();
