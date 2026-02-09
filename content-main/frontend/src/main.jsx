import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider
import App from '@/App.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider> {/* Wrap App with HelmetProvider */}
      <App />
    </HelmetProvider>
  </React.StrictMode>,
) 