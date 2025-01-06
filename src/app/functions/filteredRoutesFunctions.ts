import {
  getRoutesByOwnerId,
  getRoutesInYourArea,
} from "@/app/services/routeService";
import Route from "@/app/types/routes";
import { getUserToken, getUserAddress } from "@/app/functions/usersFunctions";
import { fetchRouteById } from "@/app/functions/routesFunctions";
import IRoute from "@/app/types/routes";
import { getUserHistoryRoutes } from "@/app/services/userService";
import { appendRoutes } from "./routesFunctions";

export const fetchHistoryRoutes = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRoutes: (routes: Route[]) => void,
  currentPage: number,
  setLastPage?: (lastPage: boolean) => void
): Promise<void> => {
  const user = await getUserToken();
  if (!user) {
    console.error("User not found");
    return;
  }
  const { userHistory, lastPage } = await getUserHistoryRoutes(
    user.id,
    currentPage,
    setLoading
  );
  const historyRoutes: Route[] = [];
  if (userHistory) {
    for (const historyRoute of userHistory) {
      const routeId = historyRoute.routeId;
      const route: Route | undefined = await fetchRouteById(routeId.toString());
      if (route) {
        historyRoutes.push(route);
      }
    }
  }

  if (currentPage === 1) {
    setLoading(false);
    setRoutes(historyRoutes);
  } else {
    setLoading(false);
    appendRoutes(historyRoutes);
  }
  if (setLastPage)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    lastPage !== undefined ? setLastPage(lastPage) : setLastPage(true);
};

export const FetchOwnerRoutes = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRoutes: (routes: Route[]) => void,
  currentPage: number,
  setLastPage?: (lastPage: boolean) => void
): Promise<void> => {
  const userToken = getUserToken();
  if (!userToken) {
    console.error("No user token found");
    return;
  }
  try {
    if (currentPage === 1) setLoading(true);
    const response = await getRoutesByOwnerId(userToken.id, currentPage);
    const { routes, lastPage } = response;

    if (currentPage === 1) {
      setRoutes(routes);
    } else {
      setLoading(false);
      appendRoutes(routes);
    }
    if (setLastPage)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      lastPage !== undefined ? setLastPage(lastPage) : setLastPage(true);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching user routes:", error);
    setLoading(false);
  }
};

export const fetchRoutesInYourArea = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRoutes: (routes: Route[]) => void,
  currentPage: number | undefined,
  setLastPage?: (lastPage: boolean) => void,
  areaAddress?: string
): Promise<void> => {
  try {
    if (currentPage === 1) setLoading(true);
    let data: { routes: IRoute[]; lastPage: boolean };
    const userTokenFromStorage = localStorage.getItem("userToken");
    if (userTokenFromStorage) {
      if (!areaAddress) {
        const address = await getUserAddress();
        data = await getRoutesInYourArea(address as string, currentPage!);
      } else {
        data = await getRoutesInYourArea(areaAddress as string, currentPage!);
      }
      if (data && data.routes) {
        if (currentPage === 1) {
          setRoutes(data.routes);
          setLoading(false);
        } else if (appendRoutes) {
          appendRoutes(data.routes);
          setLoading(false);
        }
      } else {
        setRoutes([]);
        setLoading(false);
      }

      if (setLastPage)
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        data.lastPage !== undefined
          ? setLastPage(data.lastPage)
          : setLastPage(true);
    }
  } catch (error) {
    console.error(error);
  }
};
