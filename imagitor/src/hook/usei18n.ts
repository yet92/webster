import { useTranslation } from "react-i18next";

export type Category = "widget" | "hotkey" | "workMode";

const useI18n = () => {
  const { t, i18n } = useTranslation(["widget", "hotkey", "workMode"]);

  const getTranslation = (category: "widget" | "hotkey" | "workMode", ...values: string[]) =>
    t(`${category}:${values.join(":")}`);

    const setLanguage = (language: string) => {
      localStorage.setItem("language", language);
      i18n.changeLanguage(language);
    };

  return { getTranslation, setLanguage, currentLanguage: i18n.language  };
};

export default useI18n;
