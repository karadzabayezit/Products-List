import { createContext, useContext, useEffect, useReducer } from 'react';
import { removeDuplicates } from '../utils';
import axios from '../middleware/axios';

const INITIAL_STATE = {
  products: [],
  filteredProducts: null,
  isLoading: false,
  error: null,
  currentPage: new URLSearchParams(window.location.search).get('page') || 1,
  filterBy: {
    product: '',
    brand: '',
    price: '',
  },
};

const LIMIT = 50;

const ProductsContext = createContext();
function reducer(state, action) {
  switch (action.type) {
    case 'products/loading':
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case 'products/loaded':
      return {
        ...state,
        isLoading: false,
        products: action.payload,
      };
    case 'products/filterByProduct':
      return {
        ...state,
        filterBy: { ...state.filterBy, product: action.payload },
      };
    case 'products/filterByBrand':
      return {
        ...state,
        filterBy: { ...state.filterBy, brand: action.payload },
      };
    case 'products/filterByPrice':
      return {
        ...state,
        filterBy: { ...state.filterBy, price: Number(action.payload) },
      };
    case 'products/filtered':
      return {
        ...state,
        isLoading: false,
        filteredProducts: action.payload,
      };
    case 'products/nextPage':
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    case 'products/previousPage':
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };
    case 'products/error':
      return {
        ...state,
        error: action.payload,
      };
    case 'products/reset':
      return {
        ...INITIAL_STATE,
        products: [...state.products],
        currentPage: state.currentPage,
      };
  }
}

const ProductsProvider = ({ children }) => {
  const [{ products, filteredProducts, isLoading, error, currentPage, filterBy }, dispatch] = useReducer(
    reducer,
    INITIAL_STATE
  );

  async function getProductsByID() {
    dispatch({ type: 'products/loading' });
    try {
      const { data } = await axios({
        data: {
          action: 'get_ids',
          params: {
            offset: (currentPage - 1) * LIMIT,
            limit: LIMIT,
          },
        },
      });
      const dataIDs = data.result;
      getProducts(dataIDs);
    } catch (error) {
      dispatch({ type: 'products/error', payload: error.message });
    }
  }
  async function getProducts(dataIDs) {
    try {
      const { data } = await axios({
        data: {
          action: 'get_items',
          params: {
            ids: dataIDs,
          },
        },
      });
      const clearedData = removeDuplicates(data.result);
      if (filterBy.brand || filterBy.product || filterBy.price)
        return dispatch({ type: 'products/filtered', payload: clearedData });
      dispatch({ type: 'products/loaded', payload: clearedData });
    } catch (error) {
      dispatch({ type: 'products/error', payload: error.message });
    }
  }
  async function getFilteredProductsByID(filterType) {
    dispatch({ type: 'products/loading' });
    filterType = filterType.toLowerCase(); // to make sure
    try {
      const { data } = await axios({
        data: {
          action: 'filter',
          params: {
            [filterType]: filterBy[filterType],
          },
        },
      });
      const dataIDs = data.result;
      if (dataIDs.length === 0) throw new Error('No Product Found');
      getProducts(dataIDs);
    } catch (error) {
      dispatch({ type: 'products/error', payload: error.message });
    }
  }

  const filterList = (filterType, value) => {
    dispatch({ type: `products/filterBy${filterType}`, payload: value });
  };
  const searchProducts = () => {
    if (filterBy.brand.length > 0) return getFilteredProductsByID('brand');
    if (filterBy.price > 0) return getFilteredProductsByID('price');
    if (filterBy.product.length > 0) return getFilteredProductsByID('product');
  };
  const resetFilters = () => {
    if (products.length === 0) return getProductsByID();
    dispatch({ type: 'products/reset' });
  };
  const changePageQuery = (value) => {
    const { protocol, host, pathname } = location;
    const path = `${host + pathname}`;
    if (history.pushState) {
      const newUrl = `${protocol}//${path}?page=${value}`;
      history.pushState({ path: newUrl }, '', newUrl);
    }
  };
  const nextPage = () => {
    changePageQuery(currentPage + 1);
    dispatch({ type: 'products/nextPage' });
  };
  const previousPage = () => {
    if (currentPage > 0) {
      changePageQuery(currentPage - 1);
      dispatch({ type: 'products/previousPage' });
    }
  };

  useEffect(() => {
    getProductsByID();
  }, [currentPage]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        filterBy,
        isLoading,
        error,
        currentPage,
        filterList,
        searchProducts,
        resetFilters,
        nextPage,
        previousPage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};

function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
}

export { ProductsProvider, useProducts };
