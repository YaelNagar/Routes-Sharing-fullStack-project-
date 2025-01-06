import IRoute from "../routes";

export interface LoadMoreButtonProps {
  fetchFunction: (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setRoutes: (routes: IRoute[]) => void,
    newPage: number,
    setLastPage: (lastPage: boolean) => void,
    changeAddress?: string
  ) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean | undefined;
  setRoutes: (routes: IRoute[]) => void;
  setLastPage: (lastPage: boolean) => void;
  setCurrentPage: (updateFn: (prevPage: number) => number) => void;
  changeAddress?: string | undefined;
}
