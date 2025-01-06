import { Types } from "mongoose";

export interface PopUpRouteProps {
  onClose: () => void;
  routeId: Types.ObjectId;
  filtered: number;
}
