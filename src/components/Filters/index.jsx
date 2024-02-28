import { useProducts } from '../../contexts/ProductsContext';
import { useFiltersOnEnter } from '../../hooks/useFiltersOnEnter';

import Button from '../Button';
import Filter from './Filter';

import styles from './styles.module.scss';

const Filters = () => {
  const { searchProducts, filterBy, resetFilters } = useProducts();
  useFiltersOnEnter();
  return (
    <div className={styles.wrapper}>
      <Filter
        placeholder='Name...'
        filterType='Product'
        disabled={filterBy.price > 0 || filterBy.brand.length > 0}
      />
      <Filter
        placeholder='Brand...'
        filterType='Brand'
        disabled={filterBy.price > 0 || filterBy.product.length > 0}
      />
      <Filter
        type='number'
        placeholder='Price...'
        filterType='Price'
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
