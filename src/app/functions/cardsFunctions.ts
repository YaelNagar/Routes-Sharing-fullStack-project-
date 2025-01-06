import { addHistoryRoute } from "@/app/services/userService";
import {
  fetchUserById,
  getUserToken,
  putUserRate,
} from "@/app/functions/usersFunctions";
import { editRoutes } from "../services/routeService";
import { Types } from "mongoose";
import Swal from 'sweetalert2';

export const addRouteToHistoryRoute = async (routeId: string) => {
  const userToken = getUserToken();

  if (!userToken) {
    console.error("User token not found. Cannot add route to history.");
    return;
  }

  await addHistoryRoute(userToken.id, routeId)
    .then(() => {
      console.log(`Route ${routeId} successfully added to history.`);
    })
    .catch((error) => {
      console.error("Error adding route to history:", error);
    });
};

export const raiting = async (routeId: string, newRate: number) => {
  if (!routeId || !newRate) return null;
  const updateRate = await editRoutes(routeId, newRate);
  await putUserRate(routeId, newRate);
  return updateRate;
};

export const handleStarClick = async (
  routeId: string,
  new_rate: number,
  selectedRatings: { [routeId: string]: number },
  filtered: number,
  setSelectedRatings: React.Dispatch<
    React.SetStateAction<{ [routeId: string]: number }>
  >
) => {
  if (selectedRatings[routeId]) return;

  if (filtered === 2) {
    await raiting(routeId, new_rate);
    setSelectedRatings((prev) => ({
      ...prev,
      [routeId]: new_rate,
    }));
  }
};

export const getUserRouteRate = async (routeId: string) => {
  const user = await fetchUserById(); // משיג את המשתמש
  if (!user) {
    console.error("User not found");
    return 0;
  }
  // debugger;
  const historyRoute = user.historyRoutes.find(
    (route: { routeId: Types.ObjectId; rateRoute: number }) => {
      return route.routeId.toString() === routeId;
    }
  );
  if (!historyRoute) {
    console.log("Route not found in user historyRoutes");
    // return;
  }

  return historyRoute ? historyRoute.rateRoute : 0;
};

export const calculateRoute = (
  points: google.maps.LatLngLiteral[],
  setDirections: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >,
  setHours: React.Dispatch<React.SetStateAction<number>>,
  setMinutes: React.Dispatch<React.SetStateAction<number>>
) => {
  if (points.length < 2) {
    Swal.fire({
      icon: 'warning',
      title: 'אזהרה!',
      text: 'עליך לבחור לפחות שתי נקודות למסלול.',
      confirmButtonText: 'אוקי'
    });
    return;
  }

  const directionsService = new google.maps.DirectionsService();
  const request: google.maps.DirectionsRequest = {
    origin: points[0],
    destination: points[points.length - 1],
    waypoints: points.slice(1, -1).map((point) => ({
      location: point,
      stopover: true,
    })),
    travelMode: google.maps.TravelMode.WALKING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK && result) {
      calculateWalkingTime(result, setHours, setMinutes);
      setDirections(result);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'שגיאה!',
        text: 'לא ניתן לחשב מסלול',
        confirmButtonText: 'אוקי'
      });
    }
  });
};

export const calculateWalkingTime = (
  result: google.maps.DirectionsResult,
  setHours: React.Dispatch<React.SetStateAction<number>>,
  setMinutes: React.Dispatch<React.SetStateAction<number>>
) => {
  debugger
  let totalTimeInSeconds = 0;

  const route = result.routes[0];

  route.legs.forEach((leg) => {
    totalTimeInSeconds += leg.duration!.value;
  });
  const calculatedHours = Math.floor(totalTimeInSeconds / 3600); // שעות
  const calculatedMinutes = Math.floor((totalTimeInSeconds % 3600) / 60); // דקות

  setHours(calculatedHours);
  setMinutes(calculatedMinutes);
};

// פונקציה ללחיצה על הכפתור
export const handleSelectRoute = (
  routeId: string,
  setSelectedRoutes: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  setSelectedRoutes((prevSelectedRoutes) => {
    const updatedRoutes = new Set(prevSelectedRoutes);
    if (updatedRoutes.has(routeId)) {
      updatedRoutes.delete(routeId); // אם המסלול כבר נבחר, מסירים אותו
    } else {
      updatedRoutes.add(routeId); // אם לא, מוסיפים אותו
      addRouteToHistoryRoute(routeId); // מוסיף את המסלול להיסטוריה
    }
    return updatedRoutes;
  });
};
