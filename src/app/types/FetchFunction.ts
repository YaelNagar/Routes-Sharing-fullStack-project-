import IRoute from "./routes";

export type FetchFunction = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRoutes: (routes: IRoute[]) => void,
  currentPage: number,
  setLastPage?: (lastPage: boolean) => void,
  areaAddress?: string
) => Promise<void>;
