import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 👇 Remove HTML-based loader after React mounts
// 🧹 Smooth fade-out after load
const removePreloader = () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.remove(), 500);
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    //<App />
  //</React.StrictMode>
  <App />
);

// Remove preloader shortly after React mounts
setTimeout(removePreloader, 100);

