"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/app/components/ConnectionSteps/LoginForm";
import { loginFunction } from "@/app/services/userService";
import { z } from "zod";

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      // Validate password
      const token = await loginFunction(email, password);

      if (token) {
        router.push("/pages/home");
      } else {
        setError("שם משתמש או סיסמא שגויים");
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      } else {
        console.error("Failed to connect");
        setError("שגיאת התחברות.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div
        dir="rtl"
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          התחברות
        </h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <LoginForm onSubmit={handleLogin} />
        {/* <div className="text-center">
          <GoogleSignInButton />
        </div> */}
        <p className="mt-2 text-center text-gray-700">
          עדיין אין לך חשבון?{" "}
          <a href="./signup" className="text-blue-500">
            הרשמה
          </a>
        </p>
        <p className="mt-2 text-center text-gray-700">
        שכחת סיסמא?{" "}

          <a href="./forgetPassword" className="text-blue-500">
            שחזור סיסמא
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;
