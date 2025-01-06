"use client";

import React, { useState, useEffect } from "react";
import SignUpFormProps from "@/app/types/props/SignUpFormProps";
import { z } from 'zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const emailSchema = z
  .string()
  .email("כתובת אימייל שגויה");
const passwordSchema = z
  .string()
  .min(6, "סיסמא חייבת להכיל לפחות 6 תוים")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    "סיסמא חייבת להכיל אות, סיפרה ותו מיוחד"
  );

const nameSchema = z
  .string()
  .min(2, "שם חייב להכיל לפחות 2 תוים")
  .regex(/^[A-Za-zא-ת\s]+$/, "שם חייב להכיל רק אותיות ורווחים");

const SignUpForm: React.FC<SignUpFormProps> = ({ onContinue }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setErrorMessage(null);
  }, [fullName, email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(email);
      nameSchema.parse(fullName);
      passwordSchema.parse(password);

      setErrorMessage(null);
      onContinue(fullName, email, password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(`${error.errors[0].message}`);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <form dir="rtl" className="space-y-4" onSubmit={handleSubmit}>
      <fieldset className="border border-gray-300 p-2 rounded-lg">
        <legend className="text-md font-medium text-gray-700 px-2">שם מלא</legend>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="focus:outline-none focus:border-none w-full bg-none"
        />
      </fieldset>
      {errorMessage && errorMessage.includes("שם") && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}

      <fieldset className="border border-gray-300 p-2 rounded-lg">
        <legend className="text-md font-medium text-gray-700 px-2">אימייל</legend>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="focus:outline-none focus:border-none w-full"
        />
      </fieldset>
      {errorMessage && errorMessage.includes("כתובת אימייל") && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}

      <fieldset className="border border-gray-300 p-2 rounded-lg relative">
        <legend className="text-md font-medium text-gray-700 px-2">סיסמא</legend>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="focus:outline-none focus:border-none w-full"
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 left-2 flex items-center cursor-pointer"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </fieldset>
      {errorMessage && errorMessage.includes("סיסמא") && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 font-semibold text-black border-2 border-blue-400 rounded-md hover:shadow-md focus:outline-none focus:ring-offset-2 flex items-center justify-center"
      >
        המשך
      </button>
    </form>
  );
};

export default SignUpForm;
