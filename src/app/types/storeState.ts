import IRoute from "./routes";

export interface Token {
  id: string;
  email: string;
  name: string;
}

export interface StoreState {
  // initializeRoutes(): unknown;
  token: Token | null;
  setToken: (token: Token) => void;
  clearToken: () => void;
  Routes: IRoute[];
  setRoutes: (routes: IRoute[]) => void;
  currentPage: number;
  setCurrentPage: (
    currentPage: number | ((prevPage: number) => number)
  ) => void;
  lastPage: boolean;
  setLastPage: (lastPage: boolean) => void;
  changeAddress: string;
  setChangeAddress: (changeAddress: string) => void;
  filterAddress: boolean;
  setFilterAddress: (filterAddress: boolean) => void;
}
