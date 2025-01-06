"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "../store/store";
import {
  fetchHistoryRoutes,
  FetchOwnerRoutes,
  fetchRoutesInYourArea,
} from "../functions/filteredRoutesFunctions";
import { FilteredRoutesProps } from "../types/props/FilteredRoutesProps";
import LoadRoutes from "./LoadRoutes";
import { FetchFunction } from "../types/FetchFunction";
import AddressSearch from "./AddressSearch";
import Swal from "sweetalert2";

const SideBar: React.FC<FilteredRoutesProps> = ({
  setSelectedRoute,
  setIsAreaChoosing,
  setIsAddRoute,
  setIsHomePage,
  setIsEditUser,
  setIsSideBarOpen,
  setLoading,
}) => {
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const setRoutes = useStore((state) => state.setRoutes);
  // סטייט חדש עבור רשימת המסלולים
  const setLastPage = useStore((state) => state.setLastPage);
  const setChangeAddress = useStore((state) => state.setChangeAddress);
  const setFilterAddress = useStore((state) => state.setFilterAddress);
  const [selectedButton, setSelectedButton] = useState("index");

  const router = useRouter();

  const handleLoadRoutes = async (
    fetchFunction: FetchFunction,
    label: string
  ) => {
    const newPage = 1;
    setCurrentPage(newPage);
    setLastPage(false);
    setSelectedRoute(label);
    await fetchFunction(setLoading, setRoutes, newPage, setLastPage);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "התנתקות",
      text: "האם אתה בטוח שברצונך להתנתק?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "כן, התנתק",
      cancelButtonText: "ביטול",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      // מחיקת הטוקן מהסטור
      if (typeof window === "undefined") {
        return null;
      }
      localStorage.removeItem("userToken");
      router.push("/pages/login");
    }
  };

  return (
    <div>
      <nav className="bg-white shadow-lg h-screen py-5 fixed top-0 right-0 min-w-[250px] px-4 font-[sans-serif] overflow-y-scroll max-h-[calc(100vh-50px)]">
        {/* כתובת */}
        <div
          onClick={() => {
            setSelectedButton("routes");
            setSelectedRoute("routes");
            handleLoadRoutes(fetchRoutesInYourArea, "routes");
            setIsHomePage(false);
            setIsAddRoute(false);
            setIsAreaChoosing(false);
            setIsEditUser(false);
          }}
        >
          <AddressSearch setLoading={setLoading} />
        </div>

        {/* עמוד ראשי */}
        <ul dir="rtl" className="mt-3">
          <li className="cursor-pointer">
            <div
              onClick={() => {
                setSelectedButton("index");
                setIsHomePage(true);
                setIsAddRoute(false);
                setIsAreaChoosing(false);
                setIsEditUser(false);
                setSelectedRoute("");
                setChangeAddress("");
                setFilterAddress(false);
                if (setIsSideBarOpen) {
                  setIsSideBarOpen(false);
                }
              }}
              className={`text-black ${
                selectedButton === "index"
                  ? "bg-blue-100"
                  : "hover:text-blue-600 hover:bg-blue-50"
              } text-sm flex items-center rounded px-4 py-3 transition-all`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-[18px] h-[18px] ml-4"
                viewBox="0 0 512 512"
              >
                <path
                  d="M197.332 170.668h-160C16.746 170.668 0 153.922 0 133.332v-96C0 16.746 16.746 0 37.332 0h160c20.59 0 37.336 16.746 37.336 37.332v96c0 20.59-16.746 37.336-37.336 37.336zM37.332 32A5.336 5.336 0 0 0 32 37.332v96a5.337 5.337 0 0 0 5.332 5.336h160a5.338 5.338 0 0 0 5.336-5.336v-96A5.337 5.337 0 0 0 197.332 32zm160 480h-160C16.746 512 0 495.254 0 474.668v-224c0-20.59 16.746-37.336 37.332-37.336h160c20.59 0 37.336 16.746 37.336 37.336v224c0 20.586-16.746 37.332-37.336 37.332zm-160-266.668A5.337 5.337 0 0 0 32 250.668v224A5.336 5.336 0 0 0 37.332 480h160a5.337 5.337 0 0 0 5.336-5.332v-224a5.338 5.338 0 0 0-5.336-5.336zM474.668 512h-160c-20.59 0-37.336-16.746-37.336-37.332v-96c0-20.59 16.746-37.336 37.336-37.336h160c20.586 0 37.332 16.746 37.332 37.336v96C512 495.254 495.254 512 474.668 512zm-160-138.668a5.338 5.338 0 0 0-5.336 5.336v96a5.337 5.337 0 0 0 5.336 5.332h160a5.336 5.336 0 0 0 5.332-5.332v-96a5.337 5.337 0 0 0-5.332-5.336zm160-74.664h-160c-20.59 0-37.336-16.746-37.336-37.336v-224C277.332 16.746 294.078 0 314.668 0h160C495.254 0 512 16.746 512 37.332v224c0 20.59-16.746 37.336-37.332 37.336zM314.668 32a5.337 5.337 0 0 0-5.336 5.332v224a5.338 5.338 0 0 0 5.336 5.336h160a5.337 5.337 0 0 0 5.332-5.336v-224A5.336 5.336 0 0 0 474.668 32zm0 0"
                  data-original="#000000"
                />
              </svg>
              <span>ראשי</span>
            </div>
          </li>
        </ul>

        {/* ניהול */}
        <div dir="rtl" className="mt-2">
          <h6 className="text-blue-600 text-sm font-bold px-4">ניהול</h6>
          <ul className="mt-3">
            {/* מסלולים שלי */}
            <li className="cursor-pointer">
              <div
                className={`text-black ${
                  selectedButton === "myRoutes"
                    ? "bg-blue-100"
                    : "hover:text-blue-600 hover:bg-blue-50"
                } text-sm flex items-center rounded px-4 py-3 transition-all`}
                onClick={() => {
                  setSelectedButton("myRoutes");
                  handleLoadRoutes(FetchOwnerRoutes, "myRoutes");
                  setIsAreaChoosing(false);
                  setIsAddRoute(false);
                  setIsEditUser(false);
                  setIsHomePage(false);
                  setChangeAddress("");
                  setFilterAddress(false);
                  if (setIsSideBarOpen) {
                    setIsSideBarOpen(false);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                  />
                </svg>
                <LoadRoutes label="מסלולים שלי" selectedRoute="myRoutes" />
              </div>
            </li>
            {/* הוספת מסלול */}
            <li className="cursor-pointer">
              <div
                onClick={() => {
                  setIsAreaChoosing(false);
                  setIsAddRoute(true);
                  setIsHomePage(false);
                  setIsEditUser(false);
                  setSelectedButton("addRoute");
                  setChangeAddress("");
                  setFilterAddress(false);
                  if (setIsSideBarOpen) {
                    setIsSideBarOpen(false);
                  }
                }}
                className={`text-black ${
                  selectedButton === "addRoute"
                    ? "bg-blue-100"
                    : "hover:text-blue-600 hover:bg-blue-50"
                } text-sm flex items-center rounded px-4 py-3 transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] ml-4"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z"
                    data-original="#000000"
                  />
                  <path
                    d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z"
                    data-original="#000000"
                  />
                  <path
                    d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z"
                    data-original="#000000"
                  />
                </svg>
                <span>הוספת מסלול</span>
              </div>
            </li>
          </ul>
        </div>

        {/* מסלולים */}
        <div dir="rtl" className="mt-3">
          <h6 className="text-blue-600 text-sm font-bold px-4">תכנון מסלול</h6>
          <ul className="mt-3">
            {/* מסלולים באזור */}
            <li className="cursor-pointer">
              <div
                className={`text-black ${
                  selectedButton === "routes"
                    ? "bg-blue-100"
                    : "hover:text-blue-600 hover:bg-blue-50"
                } text-sm flex items-center rounded px-4 py-3 transition-all`}
                onClick={() => {
                  setSelectedButton("routes");
                  handleLoadRoutes(fetchRoutesInYourArea, "routes");
                  setIsAreaChoosing(false);
                  setIsAddRoute(false);
                  setIsHomePage(false);
                  setIsEditUser(false);
                  if (setIsSideBarOpen) {
                    setIsSideBarOpen(false);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <LoadRoutes label="מסלולים באזורך" selectedRoute="routes" />
              </div>
            </li>
            {/* בחירת אזור */}
            <li className="cursor-pointer">
              <div
                onClick={() => {
                  setIsAddRoute(false);
                  setIsAreaChoosing(true);
                  setIsEditUser(false);
                  setIsHomePage(false);
                  setSelectedButton("chosenArea");
                  if (setIsSideBarOpen) {
                    setIsSideBarOpen(false);
                  }
                }}
                className={`text-black ${
                  selectedButton === "chosenArea"
                    ? "bg-blue-100"
                    : "hover:text-blue-600 hover:bg-blue-50"
                } text-sm flex items-center rounded px-4 py-3 transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-[18px] h-[18px] ml-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                  />
                </svg>

                <span>בחירת אזור</span>
              </div>
            </li>
            {/* היסטוריה */}
            <li className="cursor-pointer">
              <div
                className={`text-black ${
                  selectedButton === "history"
                    ? "bg-blue-100"
                    : "hover:text-blue-600 hover:bg-blue-50"
                } text-sm flex items-center rounded px-4 py-3 transition-all`}
                onClick={() => {
                  setSelectedButton("history");
                  handleLoadRoutes(fetchHistoryRoutes, "history");
                  setIsAreaChoosing(false);
                  setIsAddRoute(false);
                  setIsHomePage(false);
                  setIsEditUser(false);
                  setChangeAddress("");
                  setFilterAddress(false);
                  if (setIsSideBarOpen) {
                    setIsSideBarOpen(false);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px]"
                  viewBox="0 0 510 510"
                >
                  <g fillOpacity=".9">
                    <path
                      d="M255 0C114.75 0 0 114.75 0 255s114.75 255 255 255 255-114.75 255-255S395.25 0 255 0zm0 459c-112.2 0-204-91.8-204-204S142.8 51 255 51s204 91.8 204 204-91.8 204-204 204z"
                      data-original="#000000"
                    />
                    <path
                      d="M267.75 127.5H229.5v153l132.6 81.6 20.4-33.15-114.75-68.85z"
                      data-original="#000000"
                    />
                  </g>
                </svg>
                <LoadRoutes label="צפה בהיסטוריה" selectedRoute="history" />
              </div>
            </li>
          </ul>
        </div>

        {/* אזור אישי */}
        <div dir="rtl" className="mt-3">
          <h6 className="text-blue-600 text-sm font-bold px-4">אזור אישי</h6>
          <ul className="mt-3">
            {/* עריכת פרופיל */}
            <li className="cursor-pointer">
              <div
                onClick={() => {
                  setSelectedButton("editProfile");
                  setIsEditUser(true);
                  setIsAreaChoosing(false);
                  setIsAddRoute(false);
                  setIsHomePage(false);
                  if (setIsSideBarOpen) {
                    setIsSideBarOpen(false);
                  }
                }}
                className={`text-black ${
                  selectedButton === "editProfile"
                    ? "bg-blue-100"
                    : "hover:text-blue-600 hover:bg-blue-50"
                } text-sm flex items-center rounded px-4 py-3 transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] ml-4"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                    data-original="#000000"
                  />
                </svg>
                <span>עריכת פרופיל</span>
              </div>
            </li>
            {/* התנתקות */}
            <li className="cursor-pointer">
              <div
                onClick={handleLogout}
                className="text-black hover:text-blue-600 text-sm flex items-center hover:bg-blue-50 rounded px-4 py-3 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] ml-4"
                  viewBox="0 0 6.35 6.35"
                >
                  <path
                    d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                    data-original="#000000"
                  />
                </svg>
                <span>התנתקות</span>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
