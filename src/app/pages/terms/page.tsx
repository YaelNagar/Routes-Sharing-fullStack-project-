"use client";
import React from "react";
import { useRouter } from "next/navigation";

const TermsOfService = () => {
  const router = useRouter();

  return (
    <div
      dir="rtl"
      // className="relative bg-gradient-to-b from-purple-500 to-purple-800 min-h-screen text-white rtl"
    >
      {/* כפתור חזרה לדף הבית */}
      <button
        onClick={() => router.push("/pages/home")}
        className="fixed top-4 right-4 bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
      >
        →
        חזרה לדף הבית
      </button>
      <div className="flex flex-col justify-center items-center container mx-auto py-16 px-6">
        {/* <div className="container mx-auto py-16 px-6"> */}
        {/* כותרת הדף */}
        <h1 className="text-5xl text-purple-500 font-bold text-center mb-12">תנאי שימוש</h1>
        <div className="bg-white w-[70%] text-gray-800 rounded-lg shadow-lg p-8">
          {/* <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8"> */}
          {/* הקדמה */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-purple-500 mb-4">
              ברוכים הבאים ל-Routes Sharing!
            </h2>
            <p className="text-lg leading-relaxed">
              תנאי שימוש אלו (&quot;התנאים&quot;) מגדירים את הכללים וההנחיות
              לשימוש בפלטפורמה שלנו. על ידי שימוש באתר, אתם מאשרים שקראתם
              והסכמתם לתנאים אלו. אם אינכם מסכימים לתנאים, אנא הימנעו משימוש
              בשירותים שלנו.
            </p>
          </section>

          {/* שימוש מותר */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-purple-500 mb-4">
              שימוש מותר
            </h2>
            <p className="text-lg leading-relaxed">
              אתם מסכימים להשתמש באתר למטרות חוקיות בלבד. פעולות אסורות כוללות,
              אך אינן מוגבלות ל:
            </p>
            <ul className="list-disc list-inside text-lg leading-relaxed">
              <li>העלאת תוכן מזיק או פוגעני.</li>
              <li>הפרת חוקי המדינה או תקנות אחרות.</li>
              <li>הטרדה או פגיעה במשתמשים אחרים.</li>
            </ul>
          </section>

          {/* תוכן משתמש */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-purple-500 mb-4">
              תוכן משתמש
            </h2>
            <p className="text-lg leading-relaxed">
              כל תוכן שאתם מעלים (לדוגמה, מסלולים, תגובות) נשאר בבעלותכם. עם
              זאת, על ידי העלאת תוכן לפלטפורמה, אתם מעניקים לנו רישיון לא בלעדי
              לשימוש, הצגה ושיתוף של התוכן באתר.
            </p>
          </section>

          {/* אחריות מוגבלת */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-purple-500 mb-4">
              אחריות מוגבלת
            </h2>
            <p className="text-lg leading-relaxed">
              אנחנו שואפים להעניק שירותים מדויקים ואמינים, אך איננו יכולים
              להבטיח את הדיוק או הזמינות של הפלטפורמה בכל זמן. איננו אחראים לכל
              נזק שיגרם משימוש באתר.
            </p>
          </section>

          {/* סיום שימוש */}
          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-purple-500 mb-4">
              סיום השימוש
            </h2>
            <p className="text-lg leading-relaxed">
              אנו שומרים לעצמנו את הזכות להפסיק או להשעות את הגישה שלכם לאתר
              במידה ותפרו את תנאי השימוש או תעסקו בפעילות אסורה.
            </p>
          </section>

          {/* יצירת קשר */}
          <section>
            <h2 className="text-3xl font-semibold text-purple-500 mb-4">
              יצירת קשר
            </h2>
            <p className="text-lg leading-relaxed">
              אם יש לכם שאלות בנוגע לתנאים אלו, אנא צרו איתנו קשר בכתובת{" "}
              <a
                href="mailto:support@routessharing.com"
                className="text-purple-700 underline hover:text-purple-500"
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

export default TermsOfService;
