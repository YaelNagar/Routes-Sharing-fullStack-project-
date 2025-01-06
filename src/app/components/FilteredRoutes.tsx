"use client";
import React, { useEffect } from "react";
import {
  fetchHistoryRoutes,
  FetchOwnerRoutes,
  fetchRoutesInYourArea,
} from "@/app/functions/filteredRoutesFunctions";
import RouteCard from "@/app/components/RouteCard";
import useStore from "@/app/store/store";
import { FilteredRoutesProps } from "../types/props/FilteredRoutesProps";
import LoadMoreButton from "./LoadMoreButton";
import { displayPoints } from "../functions/areaChoosingFunctions";

const FilteredRoutes: React.FC<FilteredRoutesProps> = ({
  selectedRoute,
  setSelectedRoute,
  setLoading,
  loading,
}) => {
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const setChangeAddress = useStore((state) => state.setChangeAddress);
  const changeAddress = useStore((state) => state.changeAddress);
  const Routes = useStore((state) => state.Routes);
  // const initializeRoutes = useStore((state) => state.initializeRoutes);
  const setRoutes = useStore((state) => state.setRoutes);
  const lastPage = useStore((state) => state.lastPage);
  const setLastPage = useStore((state) => state.setLastPage);
  const filterAddress = useStore((state) => state.filterAddress);

  // אם אין מסלולים, נטען את המסלולים הראשונים
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (
  //       Routes &&
  //       Routes.length === 0 &&
  //       selectedRoute === "routes" &&
  //       changeAddress.length === 0
  //     ) {
  //       initializeRoutes();
  //     }
  //   };
  //   fetchData();
  // }, [Routes, selectedRoute, changeAddress]);

  useEffect(() => {
    if (filterAddress) {
      setSelectedRoute("routes");
    } else if (changeAddress) {
      setSelectedRoute("chosenArea");
    }
  }, [changeAddress]);

  return (
    // <div className="flex flex-col">
    <div className="flex flex-col w-full items-center">
      {/* אם נבחר מסלול "routes" */}
      {selectedRoute === "routes" && (
        <>
          <RouteCard Routes={Routes} filtered={1} loading={loading} />
          {!lastPage && (
            <LoadMoreButton
              fetchFunction={fetchRoutesInYourArea}
              setLoading={setLoading}
              loading={loading}
              setRoutes={setRoutes}
              setLastPage={setLastPage}
              setCurrentPage={setCurrentPage}
              changeAddress={changeAddress} // העברת changeAddress
            />
          )}
        </>
      )}
      {/* אם נבחרה היסטוריית מסלולים */}
      {selectedRoute === "history" && (
        <>
          <RouteCard Routes={Routes} filtered={2} loading={loading} />
          {!lastPage && (
            <LoadMoreButton
              fetchFunction={fetchHistoryRoutes}
              setLoading={setLoading}
              loading={loading}
              setRoutes={setRoutes}
              setLastPage={setLastPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
      {/* אם נבחרו מסלולים שלי */}
      {selectedRoute === "myRoutes" && (
        <>
          <RouteCard Routes={Routes} filtered={4} loading={loading} />
          {!lastPage && (
            <LoadMoreButton
              fetchFunction={FetchOwnerRoutes}
              setLoading={setLoading}
              loading={loading}
              setRoutes={setRoutes}
              setLastPage={setLastPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
      {selectedRoute === "chosenArea" && (
        <>
          <RouteCard Routes={Routes} filtered={1} loading={loading} />
          {!lastPage && !loading && (
            <button
              onClick={(event) => {
                event.preventDefault();
                setCurrentPage((prevPage) => {
                  const newPage = prevPage + 1;
                  displayPoints(
                    setLoading,
                    setRoutes,
                    newPage,
                    setLastPage,
                    undefined,
                    undefined,
                    setChangeAddress,
                    changeAddress
                  );
                  return newPage;
                });
              }}
              className="mt-4 p-2 border border-blue-500 text-blue-500 hover:bg-blue-300 hover:text-white rounded-2xl w-[250px]"
            >
              טען עוד מסלולים {/* ↺ */}↻
            </button>
          )}
        </>
      )}
    </div>
    // </div>
  );
};

export default FilteredRoutes;
