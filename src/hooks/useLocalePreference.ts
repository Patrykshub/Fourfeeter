import { useState } from "react";
import { app } from "../model/Application";
import type { SupportedLocale } from "../i18n/utils";

const STORAGE_KEY = "locale_v1";
const DEFAULT_LOCALE: SupportedLocale = "pl-PL";

export const useLocalePreference = () => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() =>
    app().storage.readJSON<SupportedLocale>(STORAGE_KEY, DEFAULT_LOCALE),
  );

  const setLocale = (next: SupportedLocale) => {
    app().storage.writeJSON(STORAGE_KEY, next);
    setLocaleState(next);
  };

  return { locale, setLocale };
};
