import Route from "@/app/types/routes";
import { getAllRoutes, getRoutesById } from "../services/routeService";
import IRoute from "@/app/types/routes";
import useStore from "@/app/store/store";
import { getMeter } from "../services/distanceService";

export const appendRoutes = (newRoutes: IRoute[]) => {
    const state = useStore.getState();
    const Routes = state.Routes;
    const setRoutes = state.setRoutes;
    if (newRoutes.length !== 0) {
      const newArray: IRoute[] = [...Routes, ...newRoutes];
      setRoutes(newArray);
    }
};

export const fetchRouteById = async (routeId: string) => {
  try {
    const route: Route = await getRoutesById(routeId);
    return route;
  } catch (error) {
    console.error("Error fetching route data:", error);
  }
};

export const fetchCountOfRoutes = async () => {
  try {
    const routesCounter = await getAllRoutes();
    return routesCounter.length;
  } catch (error) {
    console.error("Error getting routes counter:", error);
  }
};

export const fetchCountOfKilometers = async () => {
  try {
    const kilometersCounter = await getMeter();

    return kilometersCounter.totalKilometers / 1000;
  } catch (error) {
    console.error("Error getting kilometers counter:", error);
  }
};

export const getTopRoutes = async (): Promise<IRoute[]> => {
  const routes: IRoute[] = await getAllRoutes();
  const topRoutes: IRoute[] = [];
  routes.forEach((route) => {
    // topRoutes.push({rate:route.rate, description:route.description});
    topRoutes.push(route);
    topRoutes.sort((a, b) => b.rate - a.rate);
    if (topRoutes.length > 3) topRoutes.pop();
  });
  return topRoutes;
};

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // רדיוס כדור הארץ במטרים
  const toRad = (x: number) => (x * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // מרחק במטרים
}
