import { useProducts } from '../../contexts/ProductsContext';

import styles from './styles.module.scss';

const Pagination = () => {
  const { filteredProducts, error, currentPage, nextPage, previousPage } = useProducts();
  if (error || filteredProducts) return;
  return (
    <div className={styles.productsListNav}>
      <span onClick={previousPage}>
        <i className={`${styles.arrow} ${styles.arrow__left}`}></i>
      </span>
      {currentPage}
      <span onClick={nextPage}>
        <i className={`${styles.arrow} ${styles.arrow__right}`}></i>
      </span>
    </div>
  );
};

export default Pagination;
