import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enContent from "./locales/en/content.json";
import arContent from "./locales/ar/content.json";
import frContent from "./locales/fr/content.json";
import ruContent from "./locales/ru/content.json";

const options = {
  order: [
    "querystring",
    "cookie",
    "localStorage",
    "sessionStorage",
    "navigator",
    "htmlTag",
    "path",
    "subdomain",
  ],
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
};

const resources = {
  en: enContent,
  ar: arContent,
  fr: frContent,
  ru: ruContent,
};

export const localesList = [
  { locale: "en", description: "English" },
  { locale: "ar", description: "Arabic" },
  { locale: "fr", description: "Français" },
  { locale: "ru", description: "Russian" },
];

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    //   lng: "en",
    fallbackLng: "en",
    detection: options,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
