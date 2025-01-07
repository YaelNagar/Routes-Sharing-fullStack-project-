"use client";
import Footer from "@/app/components/Footer";
import React, { useEffect, useState } from "react";
import FilteredRoutes from "@/app/components/FilteredRoutes";
import AreaRoute from "@/app/components/AreaRoute";
import SideBar from "@/app/components/SideBar";
import AddRoute from "@/app/components/AddRoute";
import HomePage from "../homePage/page";
import useStore from "@/app/store/store";
import { FaBars } from "react-icons/fa"; // אייקון של 3 פסים
import { IoClose } from "react-icons/io5"; // אייקון של סגירה
import EditUser from "@/app/components/EditUser";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isAreaChoosing, setIsAreaChoosing] = useState(false);
  const [isAddRoute, setIsAddRoute] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<string | null>("routes");
  const filterAddress = useStore((state) => state.filterAddress);
  const [isEditUser, setIsEditUser] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false); // מצב תפריט צד בתצוגה קטנה
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filterAddress === true) {
      setIsAddRoute(false);
      setIsAreaChoosing(false);
      setIsHomePage(false);
    }
  }, [filterAddress]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // גודל המסך עבור md ומעלה
        setIsSideBarOpen(false); // תסגור את ה-SideBar ברגע שהמסך גדול מ-md
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // קריאה ראשונית של הפונקציה בעת טעינת העמוד

    return () => window.removeEventListener("resize", handleResize); // ניקוי לאחר סיום השימוש
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* כותרת ואייקון של תפריט רק בתצוגת טלפון */}
      <div className="flex z-50 sticky top-0 items-center justify-between bg-gray-800 text-white p-4">
        <h1
          onClick={() => {
            router.push("/pages/Index");
          }}
          className="cursor-pointer font-cursive text-xl"
        >
          <i className="fas fa-map-signs pr-2 transform rotate-[-10deg]"></i>
          Routes Sharing
        </h1>

        <button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          aria-label="Toggle Sidebar"
          className="md:hidden ml-6"
        >
          {isSideBarOpen ? <IoClose size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {/* תוכן עמוד */}
      <div className="flex flex-1">
        {/* SideBar */}
        <div
          className={`fixed z-20 bg-white w-64 h-screen ${
            isSideBarOpen ? "translate-x-0 right-0" : "-translate-x-full"
          } md:translate-x-0 md:right-0 md:block md:scroll-container`}
        >
          <SideBar
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            setIsAreaChoosing={setIsAreaChoosing}
            setIsAddRoute={setIsAddRoute}
            setIsEditUser={setIsEditUser}
            setIsHomePage={setIsHomePage}
            setLoading={setLoading}
            setIsSideBarOpen={setIsSideBarOpen}
          />
        </div>
        {/* תוכן עמוד מרכזי */}
        <div className="flex-1 md:mr-64">
          {!isAreaChoosing && !isAddRoute && !isHomePage && !isEditUser ? (
            <div>
              <div
                dir="rtl"
                className="flex flex-col md:flex-row justify-around gap-4"
              >
                {/* <div className="md:w-auto mb-3"> */}
                <FilteredRoutes
                  selectedRoute={selectedRoute}
                  setSelectedRoute={setSelectedRoute}
                  setIsAreaChoosing={setIsAreaChoosing}
                  setIsAddRoute={setIsAddRoute}
                  setIsHomePage={setIsHomePage}
                  setIsEditUser={setIsEditUser}
                  setLoading={setLoading}
                  loading={loading}
                />
                {/* </div> */}
              </div>
            </div>
          ) : isAreaChoosing ? (
            <AreaRoute setIsAreaChoosing={setIsAreaChoosing} setLoading={setLoading}/>
          ) : isAddRoute ? (
            <AddRoute setIsAddRoute={setIsAddRoute} setLoading={setLoading} setIsHomePage={setIsHomePage}/>
          ) : isEditUser ? (
            <EditUser setIsEditUser={setIsEditUser} />
          ) : (
            isHomePage && (
              <div dir="ltr" className="w-full md:w-auto mb-3">
                <HomePage />
              </div>
            )
          )}
          {/* Footer תמיד בתחתית */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Page;