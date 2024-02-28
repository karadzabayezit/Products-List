import styles from './styles.module.scss';

const Button = ({ children, onClick, type = 'secondary' }) => {
  return (
    <button
      className={`${styles.btn} ${type === 'secondary' && styles.btn__secondary}`}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
