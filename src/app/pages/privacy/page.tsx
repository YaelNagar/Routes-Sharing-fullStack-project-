"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div
      dir="rtl"
      // className="relative bg-gradient-to-b from-green-500 to-green-800 min-h-screen text-white"
    >
      {/* כפתור חזרה לדף הבית */}
      <button
        onClick={() => router.push("/pages/home")}
        className="fixed top-4 right-4 bg-white text-green-400 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
      >
        →
        חזרה לדף הבית
      </button>

      <div className="flex flex-col justify-center items-center container mx-auto py-16 px-6">
        {/* כותרת הדף */}
        <h1 className="text-5xl font-bold text-center text-green-300 mb-12">מדיניות פרטיות</h1>

        <div className="bg-white w-[70%] text-gray-800 rounded-lg shadow-lg p-8">
          {/* מבוא */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              הקדמה
            </h2>
            <p className="text-lg leading-relaxed">
              ב-<strong>Routes Sharing</strong> אנו מעריכים את פרטיותכם. מדיניות
              פרטיות זו מתארת כיצד אנו אוספים, משתמשים ומגנים על המידע האישי
              שלכם בזמן השימוש בפלטפורמה שלנו.
            </p>
          </section>

          {/* מידע שנאסף */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              המידע שאנו אוספים
            </h2>
            <ul className="list-disc list-inside text-lg leading-relaxed">
              <li>
                מידע אישי, כמו שם, כתובת דוא&quot;ל וגיל, שנמסר במהלך ההרשמה.
              </li>
              <li>נתוני מיקום לשיתוף מסלולים והמלצות.</li>
              <li>
                נתונים טכניים, כמו סוג דפדפן וסטטיסטיקות שימוש, כדי לשפר את
                הפלטפורמה שלנו.
              </li>
            </ul>
          </section>

          {/* איך המידע משומש */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              כיצד אנו משתמשים במידע שלכם
            </h2>
            <p className="text-lg leading-relaxed">המידע שאנו אוספים משמש ל:</p>
            <ul className="list-disc list-inside text-lg leading-relaxed">
              <li>שיפור חווית השימוש שלכם בפלטפורמה.</li>
              <li>הצעת המלצות מותאמות אישית.</li>
              <li>יצירת קשר איתכם בנוגע לעדכונים ופיצ&apos;רים חדשים.</li>
            </ul>
          </section>

          {/* שיתוף מידע */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              שיתוף מידע
            </h2>
            <p className="text-lg leading-relaxed">
              אנו לא מוכרים או משתפים את המידע האישי שלכם עם צדדים שלישיים, למעט
              במקרים שבהם:
            </p>
            <ul className="list-disc list-inside text-lg leading-relaxed">
              <li>יש דרישה חוקית לכך.</li>
              <li>
                יש צורך בשיתוף מידע לצורך מתן שירותים (למשל, שיתוף מסלולים שאתם
                מפרסמים עם משתמשים אחרים).
              </li>
            </ul>
          </section>

          {/* אבטחת מידע */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              אבטחת מידע
            </h2>
            <p className="text-lg leading-relaxed">
              אנו נוקטים באמצעי אבטחה מחמירים כדי להגן על המידע שלכם. האמון שלכם
              הוא בראש סדר העדיפויות שלנו, ואנו פועלים כל הזמן לשמור על המידע
              שלכם בטוח.
            </p>
          </section>

          {/* יצירת קשר */}
          <section>
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              יצירת קשר
            </h2>
            <p className="text-lg leading-relaxed">
              אם יש לכם שאלות או דאגות בנוגע למדיניות פרטיות זו, אתם מוזמנים
              ליצור איתנו קשר בכתובת{" "}
              <a
                href="mailto:support@routessharing.com"
                className="text-green-700 underline hover:text-green-500"
              >
                support@routessharing.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
