import IRoute from "@/app/types/routes";
import mongoose, { Model, Schema } from "mongoose";

const LatLngLiteralSchema: Schema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const RoutesSchema: Schema<IRoute> = new Schema({
  ownerId: { type: Schema.Types.ObjectId},
  pointsArray: { type: [LatLngLiteralSchema], required: true },
  description: { type: String, required: false },
  rate: { type: Number, required: false },
  ratingNum: { type: Number, required: false },
  gallery: { type: [String], required: false },
});

const Routes: Model<IRoute> =
  mongoose.models.routes || mongoose.model("routes", RoutesSchema);

export default Routes;
