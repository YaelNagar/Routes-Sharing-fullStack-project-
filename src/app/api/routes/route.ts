import connect from "@/app/lib/DB/connectDB";
import Route from "@/app/lib/models/routeModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connect();

    const { ownerId, pointsArray, description, gallery } =
      await request.json();

    const newRoute = new Route({
      ownerId: ownerId,
      pointsArray: pointsArray,
      description: description,
      rate:0,
      ratingNum:0,
      gallery: gallery
    });

    await newRoute.save();

    return NextResponse.json({ route: newRoute }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { massage: "Error: failed to create route" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connect();
    const routes = await Route.find();

    if (routes) return NextResponse.json(routes, { status: 200 });
    else
      return NextResponse.json({ error: "routes not found" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
