import connect from "@/app/lib/DB/connectDB";
import Routes from "@/app/lib/models/routeModel";
import { NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";
import { calculateDistance } from "@/app/functions/routesFunctions";

// הגדרת הלקוח של גוגל מפס
const googleMaps = new Client({});
const LIMIT = 6;

export async function POST(request: Request) {
  try {
    const { address, page = 1 } = await request.json();
    const skip = (page - 1) * LIMIT;

    if (!address) {
      return NextResponse.json(
        { error: true, message: "Address is required" },
        { status: 400 }
      );
    }

    await connect();

    const response = await googleMaps.geocode({
      params: {
        address: address,
        key: process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY!,
      },
    });

    const { lat, lng } = response.data.results[0].geometry.location;

    const allRoutes = await Routes.find();

    const nearbyRoutes = allRoutes.filter((route) =>
      route.pointsArray.every(
        (point: { lat: number; lng: number }) =>
          calculateDistance(lat, lng, point.lat, point.lng) <= 3000
      )
    );
    const totalPages = Math.ceil(nearbyRoutes.length / LIMIT);

    if (!nearbyRoutes.length) {
      return NextResponse.json(
        { error: false, message: "No routes found within 3 km of the address" },
        { status: 210 }
      );
    }

    return NextResponse.json(
      {
        routes: nearbyRoutes.slice(skip, skip + LIMIT),
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
