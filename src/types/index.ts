export type DataIDs = {
  id: string;
};
export interface IProduct {
  product: string;
  brand: string;
  price: string;
  id: string;
}
export interface ISate {
  products: IProduct[];
  filteredProducts: IProduct[] | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  filterBy: {
    [key: string]: string | number;
    product: string;
    brand: string;
    price: number;
  };
}
export interface IAction {
  type: string;
  payload?: any;
}

export interface IProductsContext extends ISate {
  filterList: (filterType: string, value: string) => void;
  searchProducts: () => void;
  resetFilters: () => void;
  nextPage: () => void;
  previousPage: () => void;
}
