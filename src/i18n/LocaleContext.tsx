import { createContext, useContext } from "react";
import type { SupportedLocale } from "./utils";

interface ILocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

const LocaleContext = createContext<ILocaleContextValue | null>(null);

const useLocale = (): ILocaleContextValue => {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within LocaleContext.Provider");
  }
  return value;
};

export { LocaleContext, useLocale };
export type { ILocaleContextValue };
