import React, { useEffect } from "react";
import { Outlet, useSearchParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Navbar from "../pages/Member-Side/Homepage/Navigation/Navbar";

const MemberSideLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Set default language and sync with i18next
  useEffect(() => {
    const currentLang = searchParams.get("lng") || "en";

    if (!searchParams.get("lng")) {
      setSearchParams({ lng: currentLang });
    }

    // Sync i18next language with URL param
    i18n.changeLanguage(currentLang);
  }, [searchParams, setSearchParams, i18n]);

  const handleLanguageChange = (newLang) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lng", newLang);
    setSearchParams(newParams);

    // Change i18next language as well
    i18n.changeLanguage(newLang);
  };

  return (
    <div
      className="flex w-full flex-col min-h-screen bg-gray-50"
      dir={i18n.dir()}
    >
      <Navbar
        language={searchParams.get("lng") || "en"}
        onLanguageChange={handleLanguageChange}
      />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberSideLayout;
