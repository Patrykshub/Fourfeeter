import { createContext, useContext } from "react";
import type { SupportedLocale } from "./utils";

interface ILocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

export const LocaleContext = createContext<ILocaleContextValue | null>(null);

export const useLocale = (): ILocaleContextValue => {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within LocaleContext.Provider");
  }
  return value;
};

export type { ILocaleContextValue };
