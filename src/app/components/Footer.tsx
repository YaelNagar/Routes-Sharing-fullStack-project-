import React from "react";

const Footer = () => {
  return (
    <footer
      className="shadow-inner shadow-blue-200 bg-blue-50 text-blue-900 py-4 mt-14"
      dir="rtl"
    >
      <div className="container mx-auto text-center">
        <p className="text-xs">Routes Sharing {new Date().getFullYear()} &copy; כל הזכויות שמורות</p>
        {/* פס מפריד */}
        <hr className="border-t border-blue-300 my-4 w-3/4 mx-auto" />
        {/* קישורי מידע */}
        <div className="mt-2">
          <a
            href="/pages/about"
            className="text-blue-900 hover:text-gray-400 mx-2"
          >
            אודותינו
          </a>
          <a
            href="/pages/privacy"
            className="text-blue-900 hover:text-gray-400 mx-2"
          >
            מדיניות פרטיות
          </a>
          <a
            href="/pages/terms"
            className="text-blue-900 hover:text-gray-400 mx-2"
          >
            תנאי שימוש
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
