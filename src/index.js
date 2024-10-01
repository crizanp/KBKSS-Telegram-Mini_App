import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Updated import
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';  // Updated import

const queryClient = new QueryClient();

// Check if Telegram WebApp is available
if (window.Telegram && window.Telegram.WebApp) {
  const TELEGRAM = window.Telegram.WebApp;
  TELEGRAM.setHeaderColor('#000000'); // Set the header color
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
