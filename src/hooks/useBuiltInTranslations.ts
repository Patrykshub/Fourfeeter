import { useEffect, useState } from "react";
import { IMessages, importAllMessages } from "../i18n/utils";

export const useBuiltInTranslations = () => {
  const [builtInMessages, setBuiltInMessages] = useState<IMessages | undefined>(
    undefined,
  );

  useEffect(() => {
    importAllMessages(["pl-PL", "en-GB", "de-DE"])
      .then((msgs) => {
        setBuiltInMessages(msgs);
      })
      .catch((e: Error) =>
        console.log(`importAllMessages error!: ${e.message}`),
      );
  }, []);

  return builtInMessages;
};
