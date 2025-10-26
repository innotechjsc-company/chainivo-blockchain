import { useState } from "react";
import { LANGUAGES, type Language } from "../constants";

export const useLanguage = () => {
  const [language, setLanguage] = useState("vi");

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    // TODO: Implement toast notification when toast service is ready
    // TODO: Implement i18n integration when i18n is set up
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  return {
    language,
    languages: LANGUAGES,
    currentLanguage,
    handleLanguageChange,
  };
};
