import connect from "@/app/lib/DB/connectDB";
import User from "@/app/lib/models/userModel";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(request: Request, props: Props) {
  const LIMIT = 6;

  try {
    await connect();
    const { userId } = await props.params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * LIMIT;

    const user = await User.findById(userId);
    const userHistory = user?.historyRoutes.slice(skip, skip + LIMIT);
    const totalPages = user?.historyRoutes.length
      ? Math.ceil(user?.historyRoutes.length / LIMIT)
      : 1;

    return NextResponse.json(
      { userHistory: userHistory, lastPage: totalPages == page },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
