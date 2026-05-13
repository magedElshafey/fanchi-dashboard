import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

const saved = localStorage.getItem("lang");
const initial = (saved === "ar" || saved === "en") ? saved : "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: initial,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export function applyDocumentDirection(lang: string) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
}

applyDocumentDirection(initial);

export default i18n;
