import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en";
import hi from "./locales/hi";
import es from "./locales/es";
import pt from "./locales/pt";

export const SUPPORTED_LOCALES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "pt", label: "Portuguese", native: "Português" },
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];

const isBrowser = typeof window !== "undefined";

if (!i18n.isInitialized) {
  const base = i18n.use(initReactI18next);
  // Detector runs only on the client — server always renders English so
  // hydration matches; the switcher updates the language post-mount.
  if (isBrowser) base.use(LanguageDetector);
  base.init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es },
      pt: { translation: pt },
    },
    lng: isBrowser ? undefined : "en",
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LOCALES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "crisppdf-lang",
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });
}

export default i18n;
