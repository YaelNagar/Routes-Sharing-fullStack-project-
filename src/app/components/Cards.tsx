import React, { useState } from "react";
import CardMap from "./CardMap";
import RouteCardProps from "../types/props/‎RouteCardProps";
import { handleSelectRoute } from "@/app/functions/cardsFunctions";

const RouteCard: React.FC<RouteCardProps> = ({ Routes, filtered }) => {
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set());
  
  // טיפול בשגיאה אם המערך ריק
  if (!Routes || Routes.length === 0) {
    return (
      <div className="text-center p-6 text-red-500">
        <p>No routes available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Routes.map((route, index) => (
          <div
            key={index}
            className="max-w-md min-w-[500px] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <CardMap points={route.pointsArray} route={route} filtered={filtered}/>
            <p>rate: {route.rate}</p>
            <p>numRate: {route.ratingNum}</p>
            {filtered === 1 && (
              <button
                onClick={() => handleSelectRoute(route._id as string, setSelectedRoutes)}
                className={`mt-4 px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 ${
                  selectedRoutes.has(route._id as string)
                    ? "bg-green-600 text-white hover:bg-green-700 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                disabled={selectedRoutes.has(route._id as string)} // אם המסלול נבחר, הכפתור יהיה לא מאופשר
              >
                {selectedRoutes.has(route._id as string)
                  ? "Selected"
                  : "Select Route"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteCard;