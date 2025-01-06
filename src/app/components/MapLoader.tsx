"use client";
// עמוד שבו נטענת המפה
// מונע טעינה כפולה של המפות

import { useJsApiLoader } from "@react-google-maps/api";

const MapLoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY || "",
    libraries: ["geometry", "places"], // ייבוא הספריות הנדרשות
    language: "he", // שפה עברית
  });

  if (!isLoaded) return <p dir="rtl">טוען כתובת...</p>;

  return <>{children}</>;
};

export default MapLoader;
