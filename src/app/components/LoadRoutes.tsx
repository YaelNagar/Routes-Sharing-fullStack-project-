import React from "react";
import { LoadRoutesProps } from "../types/props/LoadRoutesProps";

const LoadRoutes: React.FC<LoadRoutesProps> = ({
  selectedRoute,
  label,
}) => {

    return (
        <div>
          <div
            className={`cursor-pointer px-4 inline-block text-center ${
              selectedRoute === label ? "border-b-4 border-slate-600 z-10" : ""
            }`}
          >
            {label}
          </div>
        </div>
      );
    };

export default LoadRoutes;
