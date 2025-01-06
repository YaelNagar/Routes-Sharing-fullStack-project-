import React from "react";

export const Loading = () => {
  return (
    <div className="h-screen flex flex-row gap-2 justify-center items-center text-2xl font-extrabold text-black">
      <span className="leading-none tracking-wide animate-bounce delay-100">L</span>
      <span className="leading-none tracking-wide animate-bounce delay-200">O</span>
      <span className="leading-none tracking-wide animate-bounce delay-300">A</span>
      <span className="leading-none tracking-wide animate-bounce delay-400">D</span>
      <span className="leading-none tracking-wide animate-bounce delay-500">I</span>
      <span className="leading-none tracking-wide animate-bounce delay-600">N</span>
      <span className="leading-none tracking-wide animate-bounce delay-700">G</span>
      <span className="leading-none tracking-wide animate-bounce delay-800">…</span>
    </div>  
  );
};

export const ReverseLoading = () => {
  return (
    <div className="h-screen flex flex-row gap-2 justify-center items-center text-2xl font-extrabold text-black">
      <span className="leading-none tracking-wide animate-bounce delay-800">…</span>
      <span className="leading-none tracking-wide animate-bounce delay-700">G</span>
      <span className="leading-none tracking-wide animate-bounce delay-600">N</span>
      <span className="leading-none tracking-wide animate-bounce delay-500">I</span>
      <span className="leading-none tracking-wide animate-bounce delay-400">D</span>
      <span className="leading-none tracking-wide animate-bounce delay-300">A</span>
      <span className="leading-none tracking-wide animate-bounce delay-200">O</span>
      <span className="leading-none tracking-wide animate-bounce delay-100">L</span>
    </div>  
  );
};

export default Loading;
