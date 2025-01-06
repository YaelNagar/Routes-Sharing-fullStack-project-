import connect from "@/app/lib/DB/connectDB";
import Route from "@/app/lib/models/routeModel";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    ownerId: string;
  }>;
};
export async function GET(request: Request, props: Props) {
  const LIMIT = 6;
  try {
    await connect();
    const { ownerId } = await props.params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * LIMIT;
    
    const routes = await Route.find({ ownerId: ownerId })
      .skip(skip)
      .limit(LIMIT);

    const totalCount = await Route.countDocuments({ ownerId: ownerId });
    return NextResponse.json(
      {
        routes,
        lastPage: Math.ceil(totalCount / LIMIT) <= page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
