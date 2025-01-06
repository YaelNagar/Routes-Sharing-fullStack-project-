import { addDistance } from "../services/distanceService";

export const calcKMAndUpdate = (points: google.maps.LatLngLiteral[]) => {
    return new Promise<number>((resolve, reject) => {
      if (points.length < 2) {
        reject("עליך לבחור לפחות שתי נקודות במסלול");
        return;
      }
  
      const directionsService = new google.maps.DirectionsService();
      
      const request: google.maps.DirectionsRequest = {
        origin: points[0], // נקודת התחלה
        destination: points[points.length - 1], // נקודת סיום
        waypoints: points.slice(1, -1).map((point) => ({
          location: point,
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.WALKING,
      };
  
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const totalDistance = result.routes[0].legs.reduce(
            (sum, leg) => sum + leg.distance!.value,
            0
          );
  
          addDistance(totalDistance); // עדכון הקילומטרים במערכת
          resolve(totalDistance); // החזרת הערך
          
        } else {
          reject("שגיאה בחישוב המסלול");
        }
      });
    });
  };
  