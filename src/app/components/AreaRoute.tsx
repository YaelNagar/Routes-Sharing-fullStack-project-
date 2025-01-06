"use client";
import React, { useState, useRef, useEffect } from "react";

import useStore from "@/app/store/store";
import AreaRouteProps from "../types/props/AreaRouteProps";
import {
  displayPoints,
  handleMapClick,
  initialize,
  resetMap,
} from "../functions/areaChoosingFunctions";
import {
  GoogleMap,
  Marker,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";

const AreaRoute: React.FC<AreaRouteProps> = ({ setIsAreaChoosing, setLoading }) => {
  const [address, setAddress] = useState("");
  const [center, setCenter] = useState<google.maps.LatLngLiteral>();
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<HTMLInputElement | null>(null);
  const [areaPoints, setAreaPoints] = useState<google.maps.LatLngLiteral[]>([]);

  const setRoutes = useStore((state) => state.setRoutes);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const setLastPage = useStore((state) => state.setLastPage);
  const setChangeAddress = useStore((state) => state.setChangeAddress);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY || "",
    libraries: ["geometry", "places"],
    language: "he",
  });

  useEffect(() => {
    initialize(isLoaded, autocompleteRef, setAddress, setCenter, mapRef);
  }, [isLoaded]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-around items-center w-[100%] mt-3">
        {/* כתובת */}
        <div dir="rtl" className="flex border items-center mt-4 space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="16px"
            className="fill-gray-600 m-1"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
          <input
            ref={autocompleteRef}
            type="text"
            placeholder={address}
            onChange={(e) => setAddress(e.target.value)}
            className=" p-2 rounded outline-none"
          />
        </div>
      </div>
      {/* כפתורי שליטה */}
      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => resetMap(setAreaPoints)}
          // className="px-4 py-2 bg-red-500 text-white rounded"
          className="mt-4 p-2 border border-red-500 text-red-500 hover:bg-red-300 hover:text-white rounded-2xl w-[200px]"
        >
          איפוס מפה
        </button>
        <button
          onClick={() => {
            const newPage = 1;
            setCurrentPage(newPage);
            {
              displayPoints(
                setLoading,
                setRoutes,
                newPage,
                setLastPage,
                areaPoints,
                setIsAreaChoosing,
                setChangeAddress,
                address
              );
            }
          }}
          disabled={areaPoints.length < 3} // הכפתור מושבת אם יש פחות מ-3 נקודות
          className={`px-4 py-2 rounded ${
            areaPoints.length < 3
              ? "mt-4 p-2 border border-gray-500 text-gray-500 hover:bg-gray-300 hover:text-white rounded-2xl w-[200px] cursor-not-allowed"
              : "mt-4 p-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-200 hover:text-white rounded-2xl w-[200px]"
          }`}
        >
          מציאת מסלולים
        </button>
      </div>

      {isLoaded ? (
        <div className="w-[80%] mb-8 border border-black rounded-xl">
          <GoogleMap
            mapContainerStyle={{
              inlineSize: "100%",
              blockSize: "475px",
              borderRadius: "11px",
            }}
            center={center}
            zoom={13}
            onClick={(event) =>
              handleMapClick(event, setAreaPoints, mapRef, polygonRef)
            }
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {areaPoints.length > 2 && (
              <Polygon
                path={areaPoints}
                options={{
                  fillColor: "yellow",
                  fillOpacity: 0.4,
                  strokeColor: "yellow",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
            {areaPoints.map((point, index) => (
              <Marker
                key={`area-${index}`}
                position={point}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                }}
              />
            ))}
          </GoogleMap>
        </div>
      ) : (
        <div>טוען מפה...</div>
      )}
    </div>
  );
};

export default AreaRoute;
