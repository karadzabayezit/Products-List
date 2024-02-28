import styles from './styles.module.scss';

const Error = ({ children }) => {
  return <h1 className={styles.error}>⛔ {children} ⛔</h1>;
};

export default Error;
