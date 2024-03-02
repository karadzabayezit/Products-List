import Filters from './components/Filters';
import Pagination from './components/PaginationField';
import ProductsList from './components/ProductsList';
import styles from './styles.module.scss';
function App() {
  return (
    <div className={styles.container}>
      <Filters />
      <ProductsList />
      <Pagination />
    </div>
  );
}

export default App;
