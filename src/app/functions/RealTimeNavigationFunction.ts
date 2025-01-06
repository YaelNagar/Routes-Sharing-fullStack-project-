import { RoutePoint, SimplePoint } from "../types/points";
import { calculateDistance } from "./routesFunctions";

//התחלת הניווט
export const startNavigation = (
  service: google.maps.DirectionsService,
  renderer: google.maps.DirectionsRenderer,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  currentIndex: number,
  waypoints: {
    lat: number;
    lng: number;
  }[],
  setInstructions: React.Dispatch<React.SetStateAction<string>>,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  googleMap: google.maps.Map | null
) => {
  //מציאת מיקום המשתמש
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setErrorMessage(null);
      updateDirections(
        currentLocation,
        service,
        renderer,
        googleMap!, // מעביר את אובייקט המפה
        currentIndex,
        waypoints,
        setInstructions,
        setCurrentIndex
      );
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        setErrorMessage("כדי להשתמש בניווט, יש לאשר גישה למיקום שלך.");
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        setErrorMessage(
          "לא ניתן לגשת למיקום כרגע. בדוק את ההגדרות או נסה שוב מאוחר יותר."
        );
      } else if (error.code === error.TIMEOUT) {
        setErrorMessage("לא הצלחנו לאתר את המיקום שלך בזמן סביר. נסה שוב.");
      } else {
        setErrorMessage("אירעה שגיאה בלתי צפויה בגישה למיקום.");
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 50000,
    }
  );

  // עצור את המעקב אם הקומפוננטה אינה בשימוש יותר
  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
};

//עידכון המסלול במהלך הניווט
const updateDirections = (
  currentLocation: google.maps.LatLngLiteral,
  //Google Maps API שמשמש לבקשת הוראות ניווט.
  service: google.maps.DirectionsService,
  //של Google Maps API, שמציג את המסלול על המפה.
  renderer: google.maps.DirectionsRenderer,
  map: google.maps.Map, // הוספת המפה כפרמטר
  //האינדקס הנוכחי במערך של נקודת הציון (waypoint) במסלול
  currentIndex: number,
  waypoints: {
    lat: number;
    lng: number;
  }[],
  //פונקציה שמעדכנת את ההוראות למשתמש
  setInstructions: React.Dispatch<React.SetStateAction<string>>,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  if (currentIndex >= waypoints.length) {
    setInstructions("הגעת לנקודת ההתחלה!");
    return;
  }

  //חותך את המערך לנקודות הרלוונטיות לאחר כל התקדמות
  const remainingWaypoints = waypoints.slice(currentIndex).map((point) => ({
    location: point,
    //מציין אם זו נקודת עצירה
    stopover: false,
  }));

  // היעד הוא הנקודה הראשונה במסלול (נקודת ההתחלה)
  const destination = waypoints[0];

  service.route(
    {
      origin: currentLocation,
      destination: destination, // יעד = נקודת ההתחלה
      waypoints: remainingWaypoints,
      travelMode: google.maps.TravelMode.WALKING,
    },
    (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        renderer.setDirections(response);
        // עדכון מרכז המפה לנקודה הנוכחית
        map.setCenter(waypoints[currentIndex]);

        // מציאת הצעד הבא
        const leg = response!.routes[0].legs[0];
        const nextStep = getNextStep(leg);

        setInstructions(nextStep);

        // בדיקת אם הגעת לנקודה הבאה במסלול
        const nextWaypoint = waypoints[currentIndex];
        const distance = haversineDistance(currentLocation, nextWaypoint);

        if (distance < 0.05) {
          setCurrentIndex((prevIndex) => prevIndex + 1); // עדכון אינדקס לנקודה הבאה
        }
      } else {
        console.error("Directions request failed", status);
      }
    }
  );
};

const getNextStep = (leg: google.maps.DirectionsLeg) => {
  if (leg.steps.length > 0) {
    return leg.steps[0].instructions.replace(/<[^>]*>?/gm, ""); // מסיר תגיות HTML
  }
  return "המשך ללכת ישר.";
};

const haversineDistance = (
  coords1: google.maps.LatLngLiteral,
  coords2: google.maps.LatLngLiteral
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // רדיוס כדור הארץ בק"מ
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // מרחק בק"מ
};

export const calculateWalkingTime = (
  points: SimplePoint[] | RoutePoint[],
  setHours: React.Dispatch<React.SetStateAction<number>>,
  setMinutes: React.Dispatch<React.SetStateAction<number>>
) => {
  const walkingSpeed = 1.39; // מהירות הליכה ממוצעת במטרים לשנייה
  let totalDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const { lat: lat1, lng: lng1 } = points[i];
    const { lat: lat2, lng: lng2 } = points[i + 1];

    totalDistance += calculateDistance(lat1, lng1, lat2, lng2);
  }

  const totalTimeInSeconds = totalDistance / walkingSpeed;
  setHours(Math.floor(totalTimeInSeconds / 3600));
  setMinutes(Math.floor((totalTimeInSeconds % 3600) / 60));
};
