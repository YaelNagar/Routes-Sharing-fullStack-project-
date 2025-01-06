import React, { useState } from "react";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import StarProps from "@/app/types/props/starProps";

const Star: React.FC<StarProps> = ({ rate, filtered, onClick }) => {
  const [hoveredRate, setHoveredRate] = useState<number | null>(null); // דירוג זמני לצביעה
  const [selectedRate, setSelectedRate] = useState<number | null>(null); // דירוג שנבחר בלחיצה

  // יצירת המערך של הכוכבים
  const starsArray = Array(5).fill("empty");
  if (filtered !== 2 && rate) {
    // אם filtered !== 2, חישוב דירוג רגיל
    starsArray.splice(
      0,
      Math.floor(rate),
      ...Array(Math.floor(rate)).fill("full")
    ); // כוכבים מלאים
    if (rate % 1 >= 0.3 && rate % 1 < 0.8)
      starsArray[Math.floor(rate)] = "half"; // כוכב חצי
    starsArray.splice(
      0,
      Math.floor(rate),
      ...Array(Math.floor(rate)).fill("full")
    ); // כוכבים מלאים
    if (rate % 1 >= 0.3 && rate % 1 < 0.8)
      starsArray[Math.floor(rate)] = "half"; // כוכב חצי
  } else if (filtered === 2 && hoveredRate !== null && rate === 0) {
    // צביעה זמנית לפי מה שנבחר
    starsArray.splice(0, hoveredRate, ...Array(hoveredRate).fill("full"));
  } else if (filtered === 2 && selectedRate !== null && rate === 0) {
    // צביעה לפי הבחירה הסופית
    starsArray.splice(0, selectedRate, ...Array(selectedRate).fill("full"));
  } else if (
    filtered === 2 &&
    rate !== null &&
    typeof rate === "number" &&
    rate >= 0
  ) {
    const fullStars = Math.floor(rate);
    const validFullStars = Math.min(fullStars, starsArray.length); // לוודא שאין חיתוך מעבר לאורך המערך
    starsArray.splice(0, validFullStars, ...Array(validFullStars).fill("full"));
  }

  return (
    <div className="flex justify-end space-x-1 mt-2" dir="ltr">
      {starsArray.map((type, index) => (
        <div
          key={index}
          className={`inline-block ${
            filtered !== 2
              ? "cursor-default"
              : rate === 0
              ? "hover:cursor-pointer"
              : "cursor-not-allowed"
          }`}
          onMouseEnter={() => {
            if (filtered === 2 && rate === 0) setHoveredRate(index + 1); // שינוי זמני של דירוג בעת מעבר עם העכבר
          }}
          onMouseLeave={() => {
            if (filtered === 2 && rate === 0) setHoveredRate(null); // איפוס זמני כאשר העכבר עוזב
          }}
          onClick={() => {
            if (filtered === 2 && rate === 0 && selectedRate === null) {
              setSelectedRate(index + 1); // עדכון דירוג סופי
              onClick?.(index + 1); // קריאה ל-onClick עם הדירוג הנבחר
            }
          }}
        >
          {type === "full" && (
            <FontAwesomeIcon icon={faStar} color={"gold"} className="w-6 h-6" />
          )}
          {type === "half" && (
            <FontAwesomeIcon
              icon={faStarHalfStroke}
              color={"gold"}
              className="w-6 h-6"
            />
          )}
          {type === "empty" && (
            <FontAwesomeIcon
              icon={regularStar}
              color={"gold"}
              className="w-6 h-6"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Star;
