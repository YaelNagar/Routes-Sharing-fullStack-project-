import { NextResponse } from "next/server";
import connect from "@/app/lib/DB/connectDB";
import Routes from "@/app/lib/models/routeModel";
import { isPointInsidePolygon } from "@/app/functions/areaChoosingFunctions";

const LIMIT = 6;

export async function POST(request: Request) {
  try {
    const { polygonPoints, page } = await request.json();
    const skip = (page - 1) * LIMIT;

    if (
      !polygonPoints ||
      !Array.isArray(polygonPoints) ||
      polygonPoints.length < 3
    ) {
      return NextResponse.json(
        {
          error: true,
          message: "Polygon is required and must have at least 3 points",
        },
        { status: 400 }
      );
    }

    await connect();

    // שליפת כל המסלולים מהמסד נתונים
    const allRoutes = await Routes.find();

    // מסלולים שנמצאים בתוך הפוליגון
    const routesInsidePolygon = allRoutes.filter((route) =>
      route.pointsArray?.every((point: { lat: number; lng: number }) =>
        isPointInsidePolygon(point, polygonPoints)
      )
    );

    if (routesInsidePolygon.length === 0) {
      return NextResponse.json(
        { error: false, message: "No routes found inside the polygon" },
        { status: 210 }
      );
    }
    const totalPages = Math.ceil(routesInsidePolygon.length / LIMIT);

    return NextResponse.json(
      {
        routes: routesInsidePolygon.slice(skip, skip + LIMIT),
        lastPage: totalPages <= page,
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: true, message: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
