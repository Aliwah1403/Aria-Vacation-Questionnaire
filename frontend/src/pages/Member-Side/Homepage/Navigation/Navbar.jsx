import React, { useState } from "react";
import AriaLogo from "@/assets/AriaLogo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { localesList } from "@/i18n";
import { LanguagesIcon } from "lucide-react";

const Navbar = ({ language, onLanguageChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={AriaLogo} alt="Company Logo" width={100} height={50} />
        </div>

        <Select
          value={language}
          onValueChange={onLanguageChange}
          defaultValue="en"
        >
          <SelectTrigger className="w-[140px]">
            <LanguagesIcon />
            <SelectValue placeholder={t("selectLanguage")} />
          </SelectTrigger>
          <SelectContent>
            {localesList.map(({ locale, description }) => (
              <SelectItem key={locale} value={locale}>
                {description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};

export default Navbar;
