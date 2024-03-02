import { FC } from 'react';
import { IProduct } from '../../../types';

import styles from './styles.module.scss';

interface IProps {
  product: IProduct;
}
const ProductItem: FC<IProps> = ({ product }) => {
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
