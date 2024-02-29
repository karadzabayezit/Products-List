//COMPONENTS
import Filters from './components/Filters';
import ProductsList from './components/ProductsList';
import Pagination from './components/PaginationField';

function App() {
  return (
    <>
      <h1>Products List</h1>
      <Filters />
      <ProductsList />
      <Pagination />
    </>
  );
}

export default App;
