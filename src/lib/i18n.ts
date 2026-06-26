import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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

export const LOCALE_STORAGE_KEY = "crisppdf-lang";

// Initialise synchronously with English on BOTH server and client so the
// first hydration render matches the server-rendered HTML exactly. The
// real user language is applied post-hydration by `applyClientLocale()`.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es },
      pt: { translation: pt },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LOCALES.map((l) => l.code),
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

function isSupported(code: string | null | undefined): code is LocaleCode {
  return !!code && SUPPORTED_LOCALES.some((l) => l.code === code);
}

/** Detect the user's locale from ?lang, localStorage, or navigator. Browser only. */
export function detectClientLocale(): LocaleCode {
  if (typeof window === "undefined") return "en";
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (isSupported(q)) return q;
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSupported(stored)) return stored;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (isSupported(nav)) return nav;
  } catch {
    /* swallow */
  }
  return "en";
}

/** Switch the i18n language post-hydration and persist it. */
export function applyClientLocale(code?: LocaleCode) {
  const lang = code ?? detectClientLocale();
  if (i18n.language !== lang) {
    void i18n.changeLanguage(lang);
  }
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, lang);
  } catch {
    /* swallow */
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
}

export default i18n;
