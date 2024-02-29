import { useProducts } from '../../contexts/ProductsContext';
import { styles } from './styles.module.scss';
import ProductItem from './ProductsItem';
import Loader from '../Loader';
import Error from '../Error';

const ProductList = () => {
  const { products, filteredProducts, isLoading, error } = useProducts();
  if (error) return <Error>{error}</Error>;
  if (isLoading) return <Loader />;
  return (
    <ul className={styles.productList}>
      {(filteredProducts ? filteredProducts : products).map((product) => (
        <ProductItem
          product={product}
          key={product.id}
        />
      ))}
    </ul>
  );
};

export default ProductList;
