import IRoute from "../routes";

export default interface RouteCardProps {
  Routes: IRoute[];
  filtered: number;
  loading: boolean | undefined;
}
