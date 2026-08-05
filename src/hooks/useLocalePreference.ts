import { useState } from "react";
import { readJSON, writeJSON } from "../lib/storage";
import type { SupportedLocale } from "../i18n/utils";

const STORAGE_KEY = "locale_v1";
const DEFAULT_LOCALE: SupportedLocale = "pl-PL";

export const useLocalePreference = () => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() =>
    readJSON<SupportedLocale>(STORAGE_KEY, DEFAULT_LOCALE),
  );

  const setLocale = (next: SupportedLocale) => {
    writeJSON(STORAGE_KEY, next);
    setLocaleState(next);
  };

  return { locale, setLocale };
};
