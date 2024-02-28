import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { getMD5Hash, removeDuplicates } from '../utils';

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
const PASSWORD = 'Valantis';
const API_URL = 'https://api.valantis.store:41000/';
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
        ...state,
        filteredProducts: null,
        filterBy: {
          product: '',
          brand: '',
          price: '',
        },
        error: null,
        isLoading: false,
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
      const response = await axios.post(
        API_URL,
        {
          action: 'get_ids',
          params: {
            offset: (currentPage - 1) * LIMIT,
            limit: LIMIT,
          },
        },
        {
          headers: {
            'X-Auth': getMD5Hash(PASSWORD),
          },
        }
      );
      const dataIDs = response.data.result;
      getProducts(dataIDs);
    } catch (error) {
      dispatch({ type: 'products/error', payload: error.message });
    }
  }
  async function getProducts(dataIDs) {
    try {
      const response = await axios.post(
        API_URL,
        {
          action: 'get_items',
          params: {
            ids: dataIDs,
          },
        },
        {
          headers: {
            'X-Auth': getMD5Hash(PASSWORD),
          },
        }
      );
      const dataProducts = response.data.result;
      const clearedData = removeDuplicates(dataProducts);
      if (filterBy.brand || filterBy.product || filterBy.price)
        return dispatch({ type: 'products/filtered', payload: clearedData });
      dispatch({ type: 'products/loaded', payload: clearedData });
    } catch (error) {
      dispatch({ type: 'products/error', payload: error.message });
    }
  }
  async function getFilteredProducts(filterType) {
    dispatch({ type: 'products/loading' });
    filterType = filterType.toLowerCase(); // to make sure
    try {
      const response = await axios.post(
        API_URL,
        {
          action: 'filter',
          params: {
            [filterType]: filterBy[filterType],
          },
        },
        {
          headers: {
            'X-Auth': getMD5Hash(PASSWORD),
          },
        }
      );
      const dataIDs = response.data.result;
      if (dataIDs.length === 0) throw new Error('No Product Found');
      getProducts(dataIDs);
    } catch (error) {
      dispatch({ type: 'products/error', payload: error.message });
    }
  }

  function filterList(filter, value) {
    dispatch({ type: `products/filterBy${filter}`, payload: value });
  }
  function searchProducts() {
    if (filterBy.brand.length > 0) return getFilteredProducts('brand');
    if (filterBy.price > 0) return getFilteredProducts('price');
    if (filterBy.product.length > 0) return getFilteredProducts('product');
  }
  function resetFilters() {
    dispatch({ type: 'products/reset' });
  }
  function changePageQuery(value) {
    const { protocol, host, pathname } = location;
    const path = `${host + pathname}`;
    if (history.pushState) {
      const newUrl = `${protocol}//${path}?page=${value}`;
      history.pushState({ path: newUrl }, '', newUrl);
    }
  }
  function nextPage() {
    changePageQuery(currentPage + 1);
    dispatch({ type: 'products/nextPage' });
  }
  function previousPage() {
    if (currentPage > 0) {
      changePageQuery(currentPage - 1);
      dispatch({ type: 'products/previousPage' });
    }
  }

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
