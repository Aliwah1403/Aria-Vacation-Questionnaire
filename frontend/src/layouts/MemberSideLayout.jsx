import React, { useEffect } from "react";
import { Outlet, useSearchParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Navbar from "../pages/Member-Side/Homepage/Navigation/Navbar";
import { DirectionProvider } from "@radix-ui/react-direction";

const MemberSideLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Get direction based on language
  const getDirection = (lang) => {
    return lang === "ar" ? "rtl" : "ltr";
  };

  // Set default language and sync with i18next
  useEffect(() => {
    const currentLang = searchParams.get("lng") || "en";

    if (!searchParams.get("lng")) {
      setSearchParams({ lng: currentLang });
    }

    // Sync i18next language with URL param
    i18n.changeLanguage(currentLang);

    // Add dir attribute to html element for global RTL support
    document.documentElement.dir = getDirection(currentLang);
  }, [searchParams, setSearchParams, i18n]);

  const handleLanguageChange = (newLang) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lng", newLang);
    setSearchParams(newParams);

    // Change i18next language and document direction
    i18n.changeLanguage(newLang);
    document.documentElement.dir = getDirection(newLang);
  };

  const currentLang = searchParams.get("lng") || "en";

  return (
    <DirectionProvider dir={getDirection(currentLang)}>
      <div className="flex w-full flex-col min-h-screen bg-gray-50">
        <Navbar
          language={currentLang}
          onLanguageChange={handleLanguageChange}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </DirectionProvider>
  );
};

export default MemberSideLayout;
