import { useProducts } from '../../contexts/ProductsContext';
import { IProduct } from '../../types';
//Components
import ProductItem from './ProductsItem';
import Loader from '../Loader';
import Error from '../Error';

import styles from './styles.module.scss';

const ProductList = () => {
  const { products, filteredProducts, isLoading, error } = useProducts();

  if (error) return <Error>{error}</Error>;
  return (
    <div className={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className={styles.productList}>
          {(filteredProducts ? filteredProducts : products).map((product: IProduct) => (
            <ProductItem
              product={product}
              key={product.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
