import { NextResponse } from "next/server";
import kilometers from "@/app/lib/models/distanceModel"; 
import dbConnect from "@/app/lib/DB/connectDB"; 
import Distance from "@/app/lib/models/distanceModel";

// פונקציה להוספת מטרים
export async function POST(request: Request) {
  try {
    await dbConnect(); // התחברות לדאטה בייס

    const {metersToAdd } = await request.json(); // קריאת הנתונים מהבקשה
    parseInt(metersToAdd);
    
    if (typeof metersToAdd !== "number" || metersToAdd <= 0) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    let doc = await Distance.findOne(); 

    if (!doc) {
      doc = await Distance.create({ totalmeters: 0 });
    }
    
    doc.totalmeters += metersToAdd;
    
    await doc.save();

    return NextResponse.json({ totalmeters: doc.totalmeters }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

// פונקציה לקבלת סך הקילומטרים
export async function GET() {
  try {
    await dbConnect();
    const doc = await kilometers.findOne();
    const totalKilometers = doc ? doc.totalmeters : 0;
    return NextResponse.json({ totalKilometers }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
