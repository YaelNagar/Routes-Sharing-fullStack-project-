import axios from "axios";
import PartialRoute from "../types/props/RouteAddingProps";

// const url = "http://localhost:3000";
const url = "https://route-sharing-bsd7.vercel.app";

export const addRoute = async (newRoute: PartialRoute) => {
  try {
    const response = await axios.post(`${url}/api/routes`, newRoute);
    return response.data;
  } catch (error) {
    console.error("Error adding route:", error);
    throw error;
  }
};

export const getRoutesById = async (routeId: string) => {
  try {
    const response = await axios.get(`${url}/api/routes/${routeId}`);
    return response.data[0];
  } catch (error) {
    console.error("Error fetching routes by route id:", error);
    throw error;
  }
};

export const getRoutesByOwnerId = async (
  ownerId: string | undefined,
  page: number
) => {
  try {
    const response = await axios.get(
      `${url}/api/routes/ownerId/${ownerId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching routes by owner id:", error);
    throw error;
  }
};

export const getRoutesInYourArea = async (
  address: string,
  currentPageAreaRoutes: number
) => {
  try {
    const response = await axios.post(`${url}/api/routesByAddress`, {
      address,
      page: currentPageAreaRoutes, // נוסיף את מספר העמוד כאן
    });
    return response.data; // נקבל את הנתונים ונספק אותם בחזרה
  } catch (error) {
    console.error("Error fetching routes:", error);
    // throw new Error("Could not fetch routes. Please try again later.");
  }
};

export const getRoutesInChosenArea = async (
  polygonPoints: {
    lat: number;
    lng: number;
  }[],
  page: number | undefined
) => {
  try {
    const response = await axios.post(`${url}/api/routesByArea`, {
      polygonPoints,
      page,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw new Error("Could not fetch routes. Please try again later.");
  }
};

export const editRoutes = async (
  routeId: string,
  rate?: number,
  gallery?: string[]
) => {
  try {
    if (rate) {
      const response = await axios.put(`${url}/api/routes/${routeId}`, {
        rate,
      });
      return response.data;
    }
    if (gallery) {
      const response = await axios.put(`${url}/api/routes/${routeId}`, {
        gallery,
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error updating route:", error);
  }
};

export const getAllRoutes = async () => {
  try {
    const response = await axios.get(`${url}/api/routes`);
    return response.data;
  } catch (error) {
    console.error("Error get routes length:", error);
    throw error;
  }
};
