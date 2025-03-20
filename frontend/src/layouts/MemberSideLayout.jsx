import React, { useState, useEffect } from "react";
import {
  Outlet,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router";
import Navbar from "../pages/Member-Side/Homepage/Navigation/Navbar";
import { localesList } from "@/i18n";
import { useTranslation } from "react-i18next";

const MemberSideLayout = () => {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle language changes and URL updates
  const handleLanguageChange = (value) => {
    const currentPath = window.location.pathname;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("lng", value);

    i18n.changeLanguage(value);
    navigate(`${currentPath}?${newUrl.searchParams.toString()}`);
  };

  // Set initial language from URL or browser
  useEffect(() => {
    const urlLang = searchParams.get("lng");
    if (urlLang && localesList.some((locale) => locale.locale === urlLang)) {
      i18n.changeLanguage(urlLang);
    }
  }, []);

  // Check if current path includes 'success'
  const isSuccessPage = location.pathname.includes("/success");

  return (
    <div
      className={`flex w-full flex-col min-h-screen bg-gray-50 ${
        i18n.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Only show Navbar if not on success page */}
      {!isSuccessPage && (
        <Navbar
          language={i18n.language}
          onLanguageChange={handleLanguageChange}
        />
      )}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberSideLayout;
