import { PropsWithChildren, Reducer, createContext, useContext, useEffect, useReducer } from 'react';
import axios from '../middleware/axios';
import { DataIDs, IAction, IProductsContext, ISate } from '../types';
import { changePageQuery, removeDuplicates } from '../utils';

const INITIAL_STATE: ISate = {
  products: [],
  filteredProducts: null,
  isLoading: false,
  error: null,
  currentPage: Number(new URLSearchParams(window.location.search).get('page')) || 1,
  filterBy: {
    product: new URLSearchParams(window.location.search).get('searchByName') || '',
    brand: new URLSearchParams(window.location.search).get('searchByBrand') || '',
    price: Number(new URLSearchParams(window.location.search).get('searchByPrice')) || 0,
  },
};
const LIMIT: number = 50;

const ProductsContext = createContext<IProductsContext | undefined>(undefined);
const reducer: Reducer<ISate, IAction> = (state, action) => {
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
        products: [...state.products] || [],
        currentPage: state.currentPage,
        filterBy: {
          product: '',
          brand: '',
          price: 0,
        },
      };
    default:
      return state;
  }
};
const ProductsProvider = ({ children }: PropsWithChildren) => {
  const [{ products, filteredProducts, isLoading, error, currentPage, filterBy }, dispatch] = useReducer(
    reducer,
    INITIAL_STATE
  );
  console.log(currentPage);
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
      if (error instanceof Error) {
        dispatch({ type: 'products/error', payload: error.message });
      }
    }
  }
  async function getProducts(dataIDs: DataIDs[]) {
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
      if (error instanceof Error) {
        dispatch({ type: 'products/error', payload: error.message });
      }
    }
  }
  async function getFilteredProductsByID(filterType: string) {
    dispatch({ type: 'products/loading' });
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
      if (error instanceof Error) {
        dispatch({ type: 'products/error', payload: error.message });
      }
    }
  }

  const filterList = (filterType: string, value: string) => {
    dispatch({ type: `products/filterBy${filterType}`, payload: value });
  };
  const searchProducts = () => {
    if (filterBy.brand.length > 0) {
      changePageQuery('searchByBrand', filterBy.brand);
      return getFilteredProductsByID('brand');
    }
    if (filterBy.price > 0) {
      changePageQuery('searchByPice', filterBy.price.toString());
      return getFilteredProductsByID('price');
    }
    if (filterBy.product.length > 0) {
      changePageQuery('searchByName', filterBy.product);
      return getFilteredProductsByID('product');
    }
  };
  const resetFilters = () => {
    changePageQuery('page', 1);
    dispatch({ type: 'products/reset' });
    if (products.length === 0) return getProductsByID();
  };

  const nextPage = () => {
    changePageQuery('page', currentPage + 1);
    dispatch({ type: 'products/nextPage' });
  };
  const previousPage = () => {
    if (Number(currentPage == 1)) return;
    changePageQuery('page', currentPage - 1);
    dispatch({ type: 'products/previousPage' });
  };

  useEffect(() => {
    if (filterBy.brand || filterBy.product || filterBy.price) {
      searchProducts();
    } else {
      getProductsByID();
    }
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
