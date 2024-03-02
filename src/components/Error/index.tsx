import { FC, PropsWithChildren } from 'react';

import styles from './styles.module.scss';

const Error: FC<PropsWithChildren> = ({ children }) => {
  return <h1 className={styles.error}>⛔ {children} ⛔</h1>;
};

export default Error;
