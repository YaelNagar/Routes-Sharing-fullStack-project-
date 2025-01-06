import IRoute from "../routes";
export interface CardMapProps {
  points: google.maps.LatLngLiteral[];
  route: IRoute | null;
  expanded?: boolean;
  filtered: number;
  routeRates?: {
    [routeId: string]: number;
  };
}
