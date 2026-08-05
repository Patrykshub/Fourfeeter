import { IntlProvider } from "react-intl";
import { useBuiltInTranslations } from "./hooks/useBuiltInTranslations";
import { Router } from "./router/Router";

const App = () => {
  const messages = useBuiltInTranslations();

  if (!messages) return null;

  return (
    <IntlProvider locale="en-GB" messages={messages["en-GB"]}>
      <Router />
    </IntlProvider>
  );
};

export default App;
