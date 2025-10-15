import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { app } from './firebase/config';

// A simple way to use 'app' to satisfy TypeScript, assuming Firebase initialization happens in config.ts
console.log('Firebase app initialized:', app);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
