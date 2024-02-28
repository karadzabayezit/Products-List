import { useProducts } from '../../contexts/ProductsContext';
import Button from '../Button';
import styles from './styles.module.scss';

const Pagination = () => {
  const { products, filteredProducts, isLoading, error, currentPage, nextPage, previousPage } = useProducts();
  if (isLoading || error || filteredProducts?.length < 49) return;
  return (
    <div className={styles.box}>
      <Button onClick={previousPage}>&larr;</Button>
      <h3>{currentPage}</h3>
      <Button
        onClick={nextPage}
        type='primary'>
        &rarr;
      </Button>
    </div>
  );
};

export default Pagination;
