import { useProducts } from '../../../contexts/ProductsContext';

import styles from './styles.module.scss';

const Filter = ({ type = 'text', disabled = false, placeholder = '', setFunction, filterType = '' }) => {
  const { filterList, filterBy } = useProducts();

  const handleChange = (e) => {
    setFunction && setFunction(e.target.value);
    filterType && filterList(filterType, e.target.value);
  };

  return (
    <input
      value={filterBy[`${filterType.toLocaleLowerCase()}`]}
      onChange={handleChange}
      type={type}
      disabled={disabled}
      className={styles.filter}
      placeholder={placeholder}
    />
  );
};

export default Filter;
