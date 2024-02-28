import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProductsProvider } from './contexts/ProductsContext.jsx';
import App from './components/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductsProvider>
      <App />
    </ProductsProvider>
  </React.StrictMode>
);
