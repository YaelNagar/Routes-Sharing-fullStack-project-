"use client";

import SignUpForm from "@/app/components/ConnectionSteps/SignupForm";
import React, { useState } from "react";
import { signupFunction } from "@/app/services/userService";
import SomeDatails from "@/app/components/ConnectionSteps/SomeDetails";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    password: string;
  } | null>(null);

  const handleSignUp = (fullName: string, email: string, password: string) => {
    setUserData({ fullName, email, password });
  };

  const handleCompleteDetails = async (address: string) => {
    if (userData?.fullName && userData.email && userData.password) {
      try {
        const token = await signupFunction(
          userData?.fullName,
          userData?.email,
          userData?.password,
          address,
          false
        );

        if (token) {
          router.push("/pages/home");
        }
      } catch (e) {
        console.error("Validation error:", e);
        // Handle the validation error
      }
    }
  };

  return (
    <div>
      {userData ? (
        <SomeDatails onSubmit={handleCompleteDetails} /> // אם יש userData, מציגים טופס להשלמת פרטים
      ) : (
        <div
          dir="rtl"
          className="flex min-h-screen items-center justify-center bg-gray-100"
        >
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              יצירת חשבון חדש
            </h2>
            <SignUpForm onContinue={handleSignUp} />
            {/* <div className="text-center">
              <GoogleSignInButton />
            </div> */}
            <p className="mt-2 text-center text-gray-700">
              יש לך חשבון?{" "}
              <a href="./login" className="text-blue-500">
                התחברות
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
