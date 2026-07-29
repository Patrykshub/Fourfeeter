import React from "react";
import { IntlProvider } from "react-intl";
import { useBuiltInTranslations } from "./hooks/useBuiltInTranslations";

export interface IEntryProps {
  children?: React.ReactNode;
}

export const Entry: React.FC<IEntryProps> = ({ children }) => {
  const messages = useBuiltInTranslations();
  return messages !== undefined ? (
    <IntlProvider locale={"en-GB"} messages={messages["en-GB"]}>
      {children}
    </IntlProvider>
  ) : null;
};
