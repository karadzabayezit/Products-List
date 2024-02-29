import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProductsProvider } from './contexts/ProductsContext';
import './global.scss';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductsProvider>
      <App />
    </ProductsProvider>
  </React.StrictMode>
);
