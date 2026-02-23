import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Bug 5: wire up ErrorBoundary properly (it exists, but is not used correctly yet). */}
    <App />
  </React.StrictMode>
);
