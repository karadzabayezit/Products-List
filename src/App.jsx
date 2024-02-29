//COMPONENTS
import Filters from './components/Filters';
import ProductList from './components/ProductsList';
import Pagination from './components/PaginationField';

function App() {
  return (
    <>
      <h1>Products List</h1>
      <Filters />
      <ProductList />
      <Pagination />
    </>
  );
}

export default App;
