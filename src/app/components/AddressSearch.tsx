"use client";
// תיבת חיפוש להזנת כתובת
// השלמה אוטומטית של גוגל-מפס
import React, { useEffect, useState, useRef } from "react";
import MapLoader from "./MapLoader";
import useStore from "@/app/store/store";
import { fetchRoutesInYourArea } from "../functions/filteredRoutesFunctions";
import {
  handleInputChange,
  handlePlaceSelect,
  isValidAddress,
} from "../functions/addressSearch";
import AddressSearchProps from "../types/props/AddressSearchProps";

const AddressSearch: React.FC<AddressSearchProps> = ({ setLoading }) => {
  const [address, setAddress] = useState(""); // כתובת שכותב המשתמש
  const [userAddress, setUserAddress] = useState(""); // כתובת שכותב המשתמש
  const [errors, setErrors] = useState<{ address?: string }>({});
  const [isSelectedFromAutocomplete, setIsSelectedFromAutocomplete] =
    useState(false); // דגל האם הכתובת נבחרה מההשלמה
  const [initialAddress, setInitialAddress] = useState(""); // כתובת מקורית לפני שינוי
  const spanRef = useRef<HTMLSpanElement>(null);
  const setRoutes = useStore((state) => state.setRoutes);
  const currentPage = useStore((state) => state.currentPage);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const setLastPage = useStore((state) => state.setLastPage);
  const setChangeAddress = useStore((state) => state.setChangeAddress);
  const changeAddress = useStore((state) => state.changeAddress);
  const setFilterAddress = useStore((state) => state.setFilterAddress);
  const filterAddress = useStore((state) => state.filterAddress);

  useEffect(() => {
    if (changeAddress === "") {
      setAddress(changeAddress);
    }
  }, [changeAddress, setChangeAddress]);

  useEffect(() => {
    const userTokenFromStorage = localStorage.getItem("userToken");
    const fetchAddress = async () => {
      const { getUserAddress } = await import("@/app/functions/usersFunctions");

      const fetchedAddress = await getUserAddress();
      if (fetchedAddress) {
        setUserAddress(fetchedAddress);
        if (address == "") setAddress(fetchedAddress); // הצגת כתובת אם קיימת
        setInitialAddress(fetchedAddress); // שמירת הכתובת המקורית
      }
    };
    if (userTokenFromStorage) {
      fetchAddress();
    }
  }, [filterAddress]);

  useEffect(() => {
    // אם הכתובת לא תקינה, נזין בחזרה את הכתובת המקורית
    if (!isSelectedFromAutocomplete && !isValidAddress(address)) {
      setAddress(initialAddress); // חוזר לכתובת המקורית
    } else {
      if (address !== userAddress && isSelectedFromAutocomplete) {
        const newPage = 1;
        setCurrentPage(newPage);
        setChangeAddress(address);
        setFilterAddress(true);
        fetchRoutesInYourArea(
          setLoading,
          setRoutes,
          currentPage,
          setLastPage,
          address
        );
      }
    }
  }, [address, isSelectedFromAutocomplete, initialAddress]);

  return (
    <>
      <MapLoader>
        {/* Span לחישוב רוחב הטקסט */}
        <span
          ref={spanRef}
          style={{
            visibility: "hidden",
            position: "absolute",
            whiteSpace: "nowrap",
          }}
        >
          {/* {address} */}
        </span>
        <div className="flex rounded-full border-2 border-blue-300 overflow-hidden max-w-52 mx-auto font-[sans-serif]">
          <input
            dir="rtl"
            type="text"
            placeholder={changeAddress === "" ? initialAddress : changeAddress}
            value={changeAddress} // תנאי לבחירת הערך
            className={`w-full outline-none bg-white text-sm px-5 py-3 ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
            onChange={(event) =>
              handleInputChange(
                event as React.ChangeEvent<HTMLInputElement>,
                setChangeAddress,
                setInitialAddress,
                setIsSelectedFromAutocomplete,
                filterAddress
              )
            }
            onFocus={(e) => {
              const autocomplete = new google.maps.places.Autocomplete(
                e.target
              );
              autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                handlePlaceSelect(
                  place.formatted_address || "",
                  setAddress,
                  setErrors,
                  setIsSelectedFromAutocomplete
                );
              });
            }}
          />

          <button
            type="button"
            className="flex items-center justify-center bg-blue-300 hover:bg-blue-400 px-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="18px"
              className="fill-white"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </button>
        </div>
      </MapLoader>
    </>
  );
};

export default AddressSearch;
