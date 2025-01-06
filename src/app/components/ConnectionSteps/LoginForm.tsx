"use client";

import React, { useState } from "react";
import LoginFormProps from "@/app/types/props/LoginFormProps";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    onSubmit(email, password).finally(() => setIsLoading(false));
  };

  return (
    <form dir="rtl" className="space-y-4" onSubmit={handleSubmit}>
      <fieldset className="border border-gray-300 p-2 rounded-lg">
        <legend className="text-md font-medium text-gray-700 px-2">
          אימייל
        </legend>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="focus:outline-none focus:border-none w-full"
        />
      </fieldset>
      <fieldset className="border border-gray-300 p-2 rounded-lg relative">
        <legend className="text-md font-medium text-gray-700 px-2">סיסמא</legend>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="focus:outline-none focus:border-none bg-none w-full"
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 left-2 flex items-center cursor-pointer"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </fieldset>
      <button
        type="submit"
        className="w-full px-4 py-2 font-semibold text-black border-2 border-blue-400 rounded-md hover:shadow-md focus:outline-none focus:ring-offset-2 focus:flex items-center justify-center"
      >
        {isLoading ? "מתחבר..." : "התחבר"}
      </button>
    </form>
  );
};

export default LoginForm;
