
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface LatLng {
  lat: number;
  lng: number;
}

const RouteMap = ({ routePoints }: { routePoints: LatLng[] }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [directions, setDirections] = useState<string[]>([]); // להוראות הדרך

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: "YOUR_GOOGLE_MAPS_API_KEY", // החלף במפתח שלך
        libraries: ["places"],
      });

      const google = await loader.load();

      // יצירת מפה
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 32.0853, lng: 34.7818 }, // תל אביב כברירת מחדל
        zoom: 12,
      });
      mapRef.current = map;

      // קבלת מיקום המשתמש
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            map.setCenter(location);
          },
          (error) => {
            console.error("Error fetching user's location:", error);
          }
        );
      }
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (mapRef.current && userLocation && routePoints.length > 0) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(mapRef.current);

      directionsService.route(
        {
          origin: userLocation, // מיקום המשתמש
          destination: routePoints[routePoints.length - 1], // הנקודה האחרונה במסלול
          waypoints: routePoints.slice(0, -1).map((point) => ({
            location: point,
            stopover: true,
          })),
          travelMode: google.maps.TravelMode.WALKING, // מצב תנועה: הליכה
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);

            // עיבוד ההוראות
            const steps = result.routes[0].legs.flatMap((leg) =>
              leg.steps.map((step) => step.instructions)
            );
            setDirections(steps); // שמירת ההוראות
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [userLocation, routePoints]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div id="map" style={{ blockSize: "500px", inlineSize: "70%" }}></div>
      <div style={{ inlineSize: "30%", overflowY: "auto", blockSize: "500px" }}>
        <h3>Walking Instructions</h3>
        <ol>
          {directions.map((instruction, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: instruction }}></li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RouteMap;
