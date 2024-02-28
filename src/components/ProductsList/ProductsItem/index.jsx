import styles from './styles.module.scss';

const ProductItem = ({ product }) => {
  const { product: name, brand, id, price } = product;
  return (
    <li className={styles.productItem}>
      <h3>{name}</h3>
      {brand && (
        <p>
          <strong>Brand:</strong> {brand}
        </p>
      )}
      <p>
        <strong>Price:</strong> {price}
      </p>
      <p>
        <strong>ID:</strong> {id}
      </p>
    </li>
  );
};

export default ProductItem;
