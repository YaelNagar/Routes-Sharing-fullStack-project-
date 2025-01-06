"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

const GoogleSignInButton = () => {
  return (
    <button
      onClick={() => signIn("google")}
      className="w-full px-4 py-2 font-semibold text-black border-2 border-red-400 rounded-md hover:shadow-md focus:outline-none focus:ring-offset-2 flex items-center justify-center"
    >
      הרשם באמצעות
      <Image
        src="https://res.cloudinary.com/dltlyphap/image/upload/v1734005002/search_mqdnia.png"
        alt="Google logo"
        className="h-6 w-6 mr-2"
        width={200}
        height={200}
      />
    </button>
  );
};

export default GoogleSignInButton;
