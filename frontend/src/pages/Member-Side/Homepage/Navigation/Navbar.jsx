import React, { useState } from "react";
import AriaLogo from "@/assets/AriaLogo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Navbar = ({ language, onLanguageChange, translations }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src={AriaLogo}
            alt="Company Logo"
            width={100}
            height={50}
            //   className="h-8 w-auto"
          />
        </div>

        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={translations.selectLanguage} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};

export default Navbar;
