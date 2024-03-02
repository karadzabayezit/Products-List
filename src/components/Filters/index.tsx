import { useEffect } from 'react';
import { useProducts } from '../../contexts/ProductsContext';

import Button from '../Button';
import Filter from './Filter';

import styles from './styles.module.scss';

const Filters = () => {
  const { searchProducts, filterBy, resetFilters, filterList } = useProducts();
  useEffect(() => {
    const searchOnEnter = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        searchProducts();
      }
    };
    document.addEventListener('keydown', searchOnEnter);
    return () => {
      document.removeEventListener('keydown', searchOnEnter);
    };
  }, [searchProducts]);
  return (
    <div className={styles.wrapper}>
      <Filter
        type='text'
        value={filterBy.product}
        filterType='Product'
        filterFunc={filterList}
        disabled={filterBy.price > 0 || filterBy.brand.length > 0}
      />
      <Filter
        type='text'
        value={filterBy.brand}
        filterType='Brand'
        filterFunc={filterList}
        disabled={filterBy.price > 0 || filterBy.product.length > 0}
      />
      <Filter
        type='number'
        value={filterBy.price}
        filterType='Price'
        filterFunc={filterList}
        disabled={filterBy.brand.length > 0 || filterBy.product.length > 0}
      />
      <Button
        type='primary'
        onClick={searchProducts}>
        Search
      </Button>
      <Button onClick={resetFilters}>Reset</Button>
    </div>
  );
};

export default Filters;
