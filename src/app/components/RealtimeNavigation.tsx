"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import RealtimeNavigationProps from "@/app/types/props/RealtimeNavigationProps";
import {
  calculateWalkingTime,
  startNavigation,
} from "../functions/RealTimeNavigationFunction";
import { useRouter } from "next/navigation";
import { FaRegClock } from "react-icons/fa";

const RealtimeNavigation: React.FC<RealtimeNavigationProps> = ({
  waypoints = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null); // שמירת רפרנס לקונטיינר של המפה
  const [, setGoogleMap] = useState<google.maps.Map | null>(null); // שמירת אובייקט המפה
  const [, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // אינדקס הנקודה הנוכחית במסלול
  const [instructions, setInstructions] = useState<string>(""); // הנחיות ניווט
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const points = [currentLocation, ...waypoints];
        calculateWalkingTime(points, setHours, setMinutes);
      },
      (error) => {
        console.error("Error getting location", error);
      }
    );

    // פונקציית ניקוי שתסיר את המעקב
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []); // אין תלות כאן כי אנחנו לא משנים את `waypoints` ישירות

  useEffect(() => {
    if (window.google && mapContainerRef.current) {
      const initializedMap = new google.maps.Map(mapContainerRef.current, {
        center: waypoints[0],
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });

      setGoogleMap(initializedMap);

      const newDirectionsService = new google.maps.DirectionsService();
      const newDirectionsRenderer = new google.maps.DirectionsRenderer({
        map: initializedMap,
        suppressMarkers: false,
      });

      setDirectionsService(newDirectionsService);
      setDirectionsRenderer(newDirectionsRenderer);

      // התחלת הניווט
      startNavigation(
        newDirectionsService,
        newDirectionsRenderer,
        setErrorMessage,
        currentIndex,
        waypoints,
        setInstructions,
        setCurrentIndex,
        initializedMap
      );
    }
  }, []);

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="flex items-center w-[80%] mt-4 bg-gray-100">
        <div
          className="p-5 flex flex-row flex-1 justify-between w-[80%] border-r-2 border-black"
          dir="rtl"
        >
          <div className="">
            <h3>הוראות ניווט:</h3>
            <p>{instructions}</p>
            {errorMessage && (
              <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
            )}
          </div>
          {(hours !== 0 || minutes !== 0) && (
            <div className="flex">
              <div className="flex items-center p-1">
                <FaRegClock />
              </div>{" "}
              <div className="flex items-center p-1">
                {hours !== 0 && `${hours}`}
                {hours !== 0 && minutes !== 0 && "."}
                {minutes && `${minutes}`}
                {hours == 0 && minutes !== 0 && " דק'"}
                {hours !== 0 && minutes !== 0 && " שעות"}
              </div>
            </div>
          )}
        </div>
        {/* חזרה לעמוד בית */}
        <div className="bg-white w-3 h-full"></div>
        <div
          onClick={() => {
            router.push("/pages/home");
          }}
          aria-label="Toggle Sidebar"
          className="cursor-pointer flex h-full items-center px-2"
        >
          <p className="text-red-800">ביטול</p>
        </div>
      </div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyD3kFjuuxQTBDSd3D8aVx0YqtFxa9onxdI&libraries=places`}
        strategy="beforeInteractive"
      />
      <div
        ref={mapContainerRef}
        style={{ blockSize: "85%", inlineSize: "80%" }}
        className="border border-black rounded-xl m-4"
      />
    </div>
  );
};

export default RealtimeNavigation;
