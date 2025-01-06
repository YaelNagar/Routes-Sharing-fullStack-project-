import { Types } from "mongoose";
import { Document } from "mongoose";

export default interface IRoute extends Document{
  ownerId: Types.ObjectId;
  pointsArray: google.maps.LatLngLiteral[];
  description: string;
  rate: number;
  ratingNum: number;
  gallery: string[];
}
