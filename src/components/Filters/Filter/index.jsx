import { useState } from 'react';
import { useProducts } from '../../../contexts/ProductsContext';

import styles from './styles.module.scss';

const Filter = ({ type = 'text', disabled = false, placeholder = '', setFunction, filterType = '' }) => {
  const { filterList, filterBy } = useProducts();
  const [value, setValue] = useState('');
  const handleChange = (e) => {
    setValue(e.target.value);
    setFunction && setFunction(e.target.value);
    filterType && filterList(filterType, e.target.value);
  };
  return (
    <input
      value={filterType ? filterBy[`${filterType.toLocaleLowerCase()}`] : value}
      onChange={handleChange}
      type={type}
      disabled={disabled}
      className={styles.filter}
      placeholder={placeholder}
    />
  );
};

export default Filter;
