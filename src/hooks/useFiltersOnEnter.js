import { useEffect } from 'react';
import { useProducts } from '../contexts/ProductsContext';

export function useFiltersOnEnter() {
  const { searchProducts } = useProducts();
  useEffect(() => {
    const searchOnEnter = (e) => {
      if (e.code === 'Enter') {
        searchProducts();
      }
    };
    document.addEventListener('keydown', searchOnEnter);
    return () => {
      document.removeEventListener('keydown', searchOnEnter);
    };
  });
}
