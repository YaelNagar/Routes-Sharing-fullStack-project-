import mongoose, { Model, Schema, Document } from "mongoose";

// הגדרת הסכימה
const DistanceSchema = new Schema({
    totalmeters: { type: Number, default: 0 },
});

interface IDistance extends Document {
    totalmeters: number;
}

const Distance: Model<IDistance> = mongoose.models.Distance || mongoose.model<IDistance>("Distance", DistanceSchema);

export default Distance;
