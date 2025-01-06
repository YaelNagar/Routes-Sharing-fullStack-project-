import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/app/lib/models/userModel";
import connect from "@/app/lib/DB/connectDB";
import { generateToken } from "@/app/functions/tokenFunction";
import Auth from "@/app/lib/models/authModel";


export async function POST(request: Request) {
  try {
    const { fullName, email, password, address } = await request.json();

    // בדיקה אם כל השדות הוזנו
    if (!fullName || !email || !password || !address) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connect(); // התחברות ל-MongoDB

    // בדיקה אם האימייל כבר קיים במערכת
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }

    // הצפנת הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedEmail = email.toLowerCase();
    await connect();

    // יצירת משתמש חדש ושמירתו ב-DB
    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      address,
      googleUser: false,
    });

    const existingAuth = await Auth.findOne({ email:normalizedEmail });
    
    if(!existingAuth){
      await Auth.create({
        email: normalizedEmail, password: hashedPassword
      });
      
    }

    //יצירת טוקן
    const token = generateToken(newUser._id.toString(), newUser.email, newUser.fullName, newUser.address, newUser.googleUser);

    return NextResponse.json(
      { message: "User created successfully", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in signUp:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
};

