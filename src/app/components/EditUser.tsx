"use client";
import React, { useState, useEffect } from "react";
import User from "@/app/types/users";
import { getUserById, putUserDetails } from "../services/userService";
import { getUserToken } from "../functions/usersFunctions";
import MapLoader from "./MapLoader";
import Image from "next/image";
import EditUserProps from "../types/props/EditUserProps";
import { Loading } from "../loading";
import useStore from "../store/store";

const EditUser: React.FC<EditUserProps> = ({ setIsEditUser }) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const setChangeAddress = useStore((state) => state.setChangeAddress);

  const userToken = getUserToken();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(userToken?.id || "");
        if (user) {
          setUserDetails(user);
          setFullName(user.fullName || "");
          setEmail(user.email || "");
          setAddress(user.address || "");
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};

    if (!fullName) validationErrors.fullName = "Full Name is required.";
    if (!email) validationErrors.email = "Email is required.";
    if (!address) validationErrors.address = "Address is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const userToUpdate = { fullName, email, address };
    putUserDetails(userToken!.id, userToUpdate);
    setIsEditUser(false);
  };

  const handlePlaceSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setChangeAddress(selectedAddress)
  };

  if (!userDetails) {
    return <Loading />;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <Image
        src="https://res.cloudinary.com/dltlyphap/image/upload/v1733825852/user_crv80f.png"
        height={70}
        width={70}
        alt="profil edit"
        className="place-self-center"
      />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <fieldset dir="rtl" className="border border-gray-300 p-2 rounded-lg">
          <legend className="text-md font-medium text-gray-700 px-2">
            שם מלא
          </legend>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="focus:outline-none focus:border-none w-full bg-none"
          />
        </fieldset>
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
        <fieldset dir="rtl" className="border border-gray-300 p-2 rounded-lg">
          <legend className="text-md font-medium text-gray-700 px-2">
            אימייל
          </legend>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="focus:outline-none focus:border-none w-full bg-none"
          />
        </fieldset>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
        <fieldset dir="rtl" className="border border-gray-300 p-2 rounded-lg">
          <legend className="text-md font-medium text-gray-700 px-2">
            כתובת
          </legend>
          <MapLoader>
            <input
              id="address"
              placeholder="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)} // הוספנו את ה-onChange
              className={`focus:outline-none focus:border-none w-full bg-none ${errors.address ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              onFocus={(e) => {
                const autocomplete = new google.maps.places.Autocomplete(
                  e.target
                );
                autocomplete.addListener("place_changed", () => {
                  const place = autocomplete.getPlace();
                  handlePlaceSelect(place.formatted_address || "");
                });
              }}
            />
          </MapLoader>
        </fieldset>
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
        >
          שליחה
        </button>
      </form>
    </div>
  );
};

export default EditUser;
