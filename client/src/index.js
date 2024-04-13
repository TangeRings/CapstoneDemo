import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FileProvider } from './components/FileContext'; // Make sure the path to FileContext.js is correct

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FileProvider> {/* Wrap App with FileProvider */}
      <App />
    </FileProvider>
  </React.StrictMode>
);

reportWebVitals();

