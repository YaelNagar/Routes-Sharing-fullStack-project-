import connect from "@/app/lib/DB/connectDB";
import User from "@/app/lib/models/userModel";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export async function PUT(request: Request, props: Props) {
  try {
    await connect();

    const { routeId, rateRoute } = await request.json();
    const { userId } = await props.params;

    if (!routeId || rateRoute === undefined) {
      return NextResponse.json(
        { message: "Missing routeId or rateRoute" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "historyRoutes.routeId": routeId },
      { $set: { "historyRoutes.$.rateRoute": rateRoute } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Route not found in historyRoutes" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Route rate updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error: failed to update route rate" },
      { status: 500 }
    );
  }
}
