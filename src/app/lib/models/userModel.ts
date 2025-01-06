import IUser from "@/app/types/users";
import mongoose, { Model, Schema } from "mongoose";

const UsersSchema: Schema<IUser> = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  googleUser: { type: Boolean, required: true },
  historyRoutes: {
    type: [
      {
        routeId: { type: Schema.Types.ObjectId },
        rateRoute: { type: Number },
      },
    ],
    required: true,
  },
});

const Users: Model<IUser> =
  mongoose.models.users || mongoose.model("users", UsersSchema);

export default Users;
