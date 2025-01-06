"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const images = [
    "https://img.freepik.com/free-photo/narrow-road-beautiful-large-field-shot-from-inside-car_181624-4035.jpg?uid=R102753681&ga=GA1.1.1641616994.1728198523&semt=ais_hybrid", // יער
    "https://img.freepik.com/free-photo/view-alps-through-windscreen-car-while-driving-curvy-road_661209-229.jpg?uid=R102753681&ga=GA1.1.1641616994.1728198523&semt=ais_hybrid", // הרים
    "https://img.freepik.com/premium-photo/scenic-view-mountains-against-sky_1048944-23211647.jpg?uid=R102753681&ga=GA1.1.1641616994.1728198523&semt=ais_hybrid",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/pages/login"); 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <header
        className="text-center py-12 text-gray-800 animate-fadeInUp relative"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl md:text-6xl text-white shadow-lg">
          גלו את המסלול הבא שלכם
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white font-semibold">
          שתפו מסלולים, קבלו השראה, וצאו לדרך עם חוויות חדשות
        </p>
        <button
          onClick={handleNavigation}
          className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-700 transition duration-300"
        >
          התחילו עכשיו
        </button>
      </header>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-12 animate-fadeInUp delay-100">
            ?איך אנחנו עוזרים לכם
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center animate-fadeInUp delay-200">
              <div className="text-2xl flex justify-center items-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                📍
              </div>
              <h3 className="text-xl font-bold text-blue-700">חקרו מסלולים</h3>
              <p className="mt-2 text-gray-600">
                מצאו מסלולים מרהיבים עם מפות, המלצות ותמונות
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center animate-fadeInUp delay-300">
              <div className="text-2xl pb-2 flex justify-center items-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                📸
              </div>
              <h3 className="text-xl font-bold text-blue-700">שתפו רגעים</h3>
              <p className="mt-2 text-gray-600">
                העלו מסלולים משלכם עם חוויות אישיות ותמונות
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center animate-fadeInUp delay-400">
              <div className="text-2xl flex justify-center items-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                🗺️
              </div>
              <h3 className="text-xl font-bold text-blue-700">
                ניווט בזמן אמת
              </h3>
              <p className="mt-2 text-gray-600">
                קבלו הנחיות מפורטות בזמן אמת עם מפות מדויקות.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-50 py-12 animate-fadeInUp delay-500">
        <div className="container mx-auto text-center text-blue-800">
          <h2 className="text-3xl font-bold mb-4">
            הצטרפו לקהילה שמחברת את כולם לשטח
          </h2>
          <p className="mb-6 text-gray-600">
            בואו לשתף, לגלות ולהתחבר לטבע כמו שלא הכרתם.
          </p>
          <button
            onClick={handleNavigation}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            התחילו את המסע
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 py-6 animate-fadeInUp delay-600">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} כל הזכויות שמורות - שיתוף מסלולים
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
