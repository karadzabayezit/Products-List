import { FC, MouseEventHandler, ReactNode } from 'react';

import styles from './styles.module.scss';

interface IProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: string;
  children: ReactNode;
}

const Button: FC<IProps> = ({ children, onClick, type = 'secondary' }) => {
  return (
    <button
      className={`${styles.btn} ${type === 'secondary' && styles.btn__secondary}`}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
