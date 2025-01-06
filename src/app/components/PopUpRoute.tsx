"use client";
import React, { useEffect, useState, useRef } from "react";
import CardMap from "./CardMap";
import CloudinaryUploader from "./CloudinaryUploader";
import { editRoutes } from "../services/routeService";
import IRoute from "../types/routes";
import { fetchRouteById } from "../functions/routesFunctions";
import { PopUpRouteProps } from "../types/props/PopUpRouteProps";
import { IoClose } from "react-icons/io5";
import ImageModal from "./ImageModal";
import { Loading } from "../loading";

const PopUpRoute: React.FC<PopUpRouteProps> = ({
  onClose,
  routeId,
  filtered,
}) => {
  const [pictures, setPictures] = useState<string[]>([]);
  const [route, setRoute] = useState<IRoute>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRoute() {
      const newRoute = await fetchRouteById(routeId.toString());

      if (newRoute) {
        setRoute(newRoute);
        if (newRoute.gallery) setPictures(newRoute.gallery);
        setIsVisible(true);
      }
    }
    fetchRoute();
  }, []);

  useEffect(() => {
    async function func() {
      if (route && pictures && pictures.length > route.gallery.length) {
        const response = await editRoutes(
          routeId.toString(),
          undefined,
          pictures
        );
        setRoute(response);
        setPictures(response.gallery);
      }
    }
    func();
  }, [pictures]);

  useEffect(() => {
    if (!isHovered && pictures.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pictures.length);
      }, 1300);
      return () => clearInterval(interval);
    }
  }, [isHovered, pictures.length]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const scrollToElement = () => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={scrollToElement}
      className={`fixed top-0 right-0 h-full 
      bg-white shadow-lg p-6 z-50 
      transition-transform duration-[500ms] transform 
      ${isVisible ? "translate-x-0" : "translate-x-full"}
      sm:w-full md:w-2/3 lg:w-1/2 pt-20 ${
        isOpen ? "overflow-hidden" : "overflow-y-auto"
      }`}
    >
      <div
        className="flex flex-row justify-between items-center w-full mb-4"
        ref={elementRef}
      >
        <div
          onClick={handleClose}
          aria-label="Toggle Sidebar"
          className="cursor-pointer"
        >
          <IoClose size={24} />
        </div>
        <h2 className="font-bold text-center flex-grow">פרטי מסלול</h2>
      </div>
      {!route ? (
        <Loading />
      ) : (
        <>
          <CardMap
            points={route.pointsArray}
            route={route}
            expanded={true}
            filtered={filtered}
          />
          <p dir="rtl" className="m-10 pr-2">
            {route.description}
          </p>
          {pictures && pictures.length > 0 && (
            <div className="flex flex-col items-center pt-10">
              <div
                className="w-[300px] h-[200px] overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <ImageModal
                  imgUrl={pictures[currentImageIndex]}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              </div>
              <div className="flex mt-2">
                {pictures.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 mx-1 rounded-full ${
                      index === currentImageIndex
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          {(filtered === 2 || filtered === 3) && (
            <CloudinaryUploader setPictures={setPictures} />
          )}
        </>
      )}
    </div>
  );
};

export default PopUpRoute;
