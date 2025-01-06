import connect from "@/app/lib/DB/connectDB";
import Route from "@/app/lib/models/routeModel";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    routeId: string;
  }>;
};

export async function GET(request: Request, props: Props) {
  try {
    await connect();
    const { routeId } = await props.params;

    const routes = await Route.find({ _id: routeId });
    return NextResponse.json(routes, { status: 200 });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, props: Props) {
  try {
    await connect();

    const { routeId } = await props.params;
    const { rate: newRate, gallery } = await request.json();

    let updatedRoute;

    // Check if newRate is provided and calculate new rating
    if (newRate) {
      const route = await Route.findById(routeId);
      if (!route) {
        return NextResponse.json({ error: "Route not found" }, { status: 404 });
      }

      // Calculate the new average rate and increment rating number
      const newUpdateRate =
        (route.rate * route.ratingNum + newRate) / (route.ratingNum + 1);
      route.rate = newUpdateRate;
      route.ratingNum = route.ratingNum + 1;

      updatedRoute = await route.save(); // Save the updated route
    }

    // Update gallery if provided
    if (gallery) {
      updatedRoute = await Route.findByIdAndUpdate(
        routeId,
        { $set: { gallery: gallery } },
        { new: true }
      );
    }

    if (updatedRoute) {
      return NextResponse.json(updatedRoute, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Route not found or no updates made" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

