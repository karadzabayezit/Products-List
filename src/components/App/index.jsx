//COMPONENTS
import Filters from '../Filters';
import ProductList from '../ProductsList';
import Pagination from '../PaginationField';

import styles from './styles.module.scss';

function App() {
  return (
    <div className={styles.root}>
      <h1>Products List</h1>
      <Filters />
      <ProductList />
      <Pagination />
    </div>
  );
}

export default App;
