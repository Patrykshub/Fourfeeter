import { IntlProvider } from "react-intl";
import { useBuiltInTranslations } from "./hooks/useBuiltInTranslations";
import { useLocalePreference } from "./hooks/useLocalePreference";
import { LocaleContext } from "./i18n/LocaleContext";
import { Router } from "./router/Router";
import { app } from "./model/Application";

const App = () => {
  app();
  const messages = useBuiltInTranslations();
  const { locale, setLocale } = useLocalePreference();

  if (!messages) return null;

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Router />
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

export default App;
