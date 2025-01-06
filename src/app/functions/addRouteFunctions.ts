import { addRoute } from "../services/routeService";
import { getUserToken } from "./usersFunctions";
import Swal from 'sweetalert2';

export const handleMapClick = (
  event: google.maps.MapMouseEvent,
  disableMapClick: boolean,
  setRoutePoints: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral[]>
  >
) => {
  if (disableMapClick) return;
  if (event.latLng) {
    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setRoutePoints((prevPoints: google.maps.LatLngLiteral[]) => [
      ...prevPoints,
      newPoint,
    ]);
  }
};

export const resetMap = (
  setRoutePoints: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral[]>
  >,
  setDirections: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >,
  setDisableMapClick: React.Dispatch<React.SetStateAction<boolean>>,
  mapRef: React.MutableRefObject<google.maps.Map | null>,
  directions: google.maps.DirectionsResult | null
) => {
  setRoutePoints([]);
  setDirections(null);
  //   clearDirectionsRenderer(mapRef, directions); // מסיר את ה-DirectionsRenderer מהמפה
  setDisableMapClick(false);
  if (mapRef.current && directions) {
    directions.routes.forEach((route) => {
      route.overview_path.forEach((path) => {
        const line = new google.maps.Polyline({
          path: [path],
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 5,
        });
        line.setMap(mapRef.current);
      });
    });
  }
};

export const calculateRoute = (
  routePoints: google.maps.LatLngLiteral[],
  description: string,
  pictures: string[],
  setDirections: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >,
  setDisableMapClick: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAddRoute: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (routePoints.length < 2) {
    Swal.fire({
      icon: 'warning',
      title: 'שגיאה',
      text: 'עליך לבחור לפחות שתי נקודות למסלול.',
      confirmButtonText: 'הבנתי'
    });
    return;
  }

  const directionsService = new google.maps.DirectionsService();
  const request: google.maps.DirectionsRequest = {
    origin: routePoints[0],
    destination: routePoints[routePoints.length - 1],
    waypoints: routePoints.slice(1, -1).map((point) => ({
      location: point,
      stopover: true,
    })),
    travelMode: google.maps.TravelMode.WALKING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK && result) {
      const allRoutePoints: google.maps.LatLngLiteral[] = [];
      const route = result.routes[0];

      allRoutePoints.push({
        lat: route.legs[0].start_location.lat(),
        lng: route.legs[0].start_location.lng(),
      });

      route.legs.forEach((leg) => {
        leg.steps.forEach((step) => {
          allRoutePoints.push({
            lat: step.end_location.lat(),
            lng: step.end_location.lng(),
          });
        });
      });

      addRoute({
        ownerId: getUserToken()!.id,
        pointsArray: allRoutePoints,
        description: description,
        gallery: pictures,
      });

      setDirections(result);
      setDisableMapClick(true);
      setIsAddRoute(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'לא ניתן לחשב מסלול.',
        confirmButtonText: 'הבנתי'
      });
    }
  });
};
