import React, { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../pages/Member-Side/Homepage/Navigation/Navbar";

const MemberSideLayout = () => {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };
  return (
    <div
      className={`flex w-full flex-col min-h-screen bg-gray-50 ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Navigation */}
      <Navbar language={language} onLanguageChange={handleLanguageChange} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberSideLayout;
