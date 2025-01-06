"use client";
import React, { useEffect, useState } from "react";
import CardMap from "./CardMap";
import RouteCardProps from "../types/props/‎RouteCardProps";
import { getUserRouteRate } from "@/app/functions/cardsFunctions";
import Image from "next/image";
import {ReverseLoading} from "../loading";

const RouteCard: React.FC<RouteCardProps> = ({ Routes, filtered, loading }) => {
  const [routeRates, setRouteRates] = useState<{ [routeId: string]: number }>(
    {}
  );

  useEffect(() => {
    if (filtered === 2) {
      fetchRates();
    }
  }, [filtered, Routes]);

  const fetchRates = async () => {
    if (!Routes || filtered !== 2) return;

    const rates: Record<string, number> = {};
    for (const route of Routes) {
      const rate = await getUserRouteRate(route._id as string);
      rates[route._id as string] = rate || 0;
    }
    console.log("Final rates to set:", rates);
    setRouteRates(rates);
  };

  return (
    <>
      {loading ? (
        <ReverseLoading />
      ) : (
        <div className="m-4 w-full">
          {Array.isArray(Routes) && Routes.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-center">
              {Routes.map((route, index) => (
                <div
                  key={index}
                  className="w-full flex-[0_0_300px] min-w-[300px] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col"
                >
                  <CardMap
                    points={route.pointsArray}
                    route={route}
                    filtered={filtered}
                    routeRates={routeRates}
                  />
                </div>
              ))}
            </div>
          ) : (
            // אין מסלולים זמינים
            <div className="flex flex-col mt-8 text-center justify-center items-center p-4 font-mono font-semibold rounded">
              <p className="text-xl">
                לא נמצאו מסלולים התואמים לחיפוש שלך. <br />
                זו ההזדמנות שלך להוסיף מסלול חדש ולשתף אותו עם כולם!
              </p>
              <Image
                src={
                  "https://res.cloudinary.com/dltlyphap/image/upload/v1735199623/33075775_isometric_businessman_with_magnifying_glass_analyze_circle_footstep-1024x1024-removebg-preview_ml81fh.png"
                }
                alt={"no routes available"}
                width={350}
                height={350}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RouteCard;
