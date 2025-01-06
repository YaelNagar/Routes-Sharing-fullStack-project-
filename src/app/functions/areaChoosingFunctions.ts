import Route from "@/app/types/routes";
import { getRoutesInChosenArea } from "../services/routeService";
import { appendRoutes } from "./routesFunctions";
import { getUserAddress } from "./usersFunctions";

export const initialize = async (
  isLoaded: boolean,
  autocompleteRef: React.MutableRefObject<HTMLInputElement | null>,
  setAddress: React.Dispatch<React.SetStateAction<string>>,
  setCenter: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral | undefined>
  >,
  mapRef: React.MutableRefObject<google.maps.Map | null>
) => {
  if (isLoaded && autocompleteRef.current) {
    const autocomplete = new google.maps.places.Autocomplete(
      autocompleteRef.current
    );

    // קריאה לפונקציה אסינכרונית לקבלת כתובת המשתמש
    const userAddress = await getUserAddress();
    setAddress(userAddress!);

    // שימוש ב-Geocoding API כדי לקבל קואורדינטות של הכתובת
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: userAddress }, (results, status) => {
      if (status === "OK" && results && results[0].geometry.location) {
        const location = results[0].geometry.location;
        setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        if (mapRef.current) {
          mapRef.current.setZoom(15);
        }
      } else {
        console.error("Geocoding failed: " + status);
      }
    });

    // מאזין לשינויים במיקום שנבחר בתיבת החיפוש
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        // עדכון מרכז המפה
        setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        // זום למיקום הנבחר
        if (mapRef.current) {
          mapRef.current.setZoom(15);
        }
        // עדכון הכתובת בתיבת החיפוש
        const formattedAddress = place.formatted_address || ""; // אם לא נמצא, השתמש בברירת מחדל ריקה
        setAddress(formattedAddress);
      }
    });
  }
};

export function isPointInsidePolygon(
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export function extractPolygonPoints(
  polygon: google.maps.Polygon
): { lat: number; lng: number }[] {
  const path = polygon.getPath();
  const points: { lat: number; lng: number }[] = [];
  for (let i = 0; i < path.getLength(); i++) {
    const point = path.getAt(i);
    points.push({ lat: point.lat(), lng: point.lng() });
  }
  return points;
}

export const handleMapClick = (
  event: google.maps.MapMouseEvent,
  setAreaPoints: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral[]>
  >,
  mapRef: React.MutableRefObject<google.maps.Map | null>,
  polygonRef: React.MutableRefObject<google.maps.Polygon | null>
) => {
  if (event.latLng) {
    const newPoint = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setAreaPoints((prevPoints) => {
      const updatedPoints = [...prevPoints, newPoint];

      // בניית הפוליגון רק אם יש יותר מ-2 נקודות
      if (updatedPoints.length > 2) {
        const polygon = new google.maps.Polygon({
          paths: updatedPoints,
          fillColor: "yellow",
          fillOpacity: 0.1,
          strokeColor: "yellow",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        });
        polygon.setMap(mapRef.current);

        polygonRef.current = polygon;
      }

      return updatedPoints;
    });
  }
};

export const resetMap = (
  setAreaPoints: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral[]>
  >
) => {
  setAreaPoints([]);
};

export const displayPoints = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRoutes: (routes: Route[]) => void,
  currentPage: number | undefined,
  setLastPage: (lastPage: boolean) => void,
  areaPoints?: google.maps.LatLngLiteral[],
  setIsAreaChoosing?: React.Dispatch<React.SetStateAction<boolean>>,
  setChangeAddress?: (changeAddress: string) => void,
  address?: string | undefined
) => {
  if (address && setChangeAddress) {
    setChangeAddress(address);
  }
  try {
    if (currentPage === 1 && setIsAreaChoosing) {
      setLoading(true);
      setIsAreaChoosing(false);
    }
    let data: { routes: Route[]; lastPage: boolean };
    if (areaPoints) {
      localStorage.setItem("areaPoints", JSON.stringify(areaPoints));
      data = await getRoutesInChosenArea(areaPoints, currentPage);
    } else {
      const savedAreaPoints = localStorage.getItem("areaPoints");
      const parsedAreaPoints = savedAreaPoints
        ? JSON.parse(savedAreaPoints)
        : [];
      data = await getRoutesInChosenArea(parsedAreaPoints, currentPage);
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
    if (setIsAreaChoosing) setIsAreaChoosing(false);
  } catch (error) {
    console.error(error);
  }
};

// פונקציה להמיר כתובת לנקודות ציון
export const geocodeAddress = (
  address: string,
  setCenter: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral>>,
  mapRef: React.MutableRefObject<google.maps.Map | null>,
  setAddress: React.Dispatch<React.SetStateAction<string>>
) => {
  const geocoder = new google.maps.Geocoder();
  if (geocoder && address) {
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results) {
        const location = results[0].geometry.location;

        // עדכון הנקודות ציון אחרי המרת הכתובת
        setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });

        // עדכון המפה אם קיימת
        if (mapRef.current) {
          mapRef.current.setZoom(15);
        }

        // עדכון הכתובת בתיבת החיפוש
        setAddress(results[0].formatted_address || "");
      } else {
        console.error(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  }
};
