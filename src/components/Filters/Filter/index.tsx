import { ChangeEvent, FC } from 'react';

import styles from './styles.module.scss';

interface IProps {
  type: string;
  value: string | number;
  disabled: boolean;
  filterType: string;
  filterFunc: (filterType: string, value: string) => void;
}
const Filter: FC<IProps> = ({ type, disabled = false, filterType, filterFunc, value }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    filterFunc(filterType, e.target.value);
  };

  return (
    <div className={styles.container}>
      <span>{filterType}:</span>
      <input
        value={value || ''}
        onChange={handleChange}
        type={type}
        disabled={disabled}
        className={styles.filter}
        placeholder={`${filterType}...`}
      />
    </div>
  );
};

export default Filter;
