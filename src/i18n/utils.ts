// based on https://github.com/formatjs/formatjs/blob/main/packages/react-intl/examples/StaticTypeSafetyAndCodeSplitting/intlHelpers.tsx

import * as sourceOfTruth from "../lang/en-GB.json";

export type LocaleMessages = typeof sourceOfTruth;
export type LocaleKey = Extract<keyof LocaleMessages, string>;
export type SupportedLocale = "en-GB";

export type IMessages = {
  [key in SupportedLocale]: LocaleMessages;
};

export const importMessages = (
  locale: SupportedLocale,
): Promise<LocaleMessages> => {
  switch (locale) {
    case "en-GB":
      return import("../lang/en-GB.json");
    default:
      throw new Error("Attempt to import unsupported locale!!!");
  }
};

export const importAllMessages = (
  locales: Array<SupportedLocale>,
): Promise<IMessages> =>
  new Promise((resolve, reject) => {
    Promise.all(
      locales.map((locale) =>
        importMessages(locale).then((msg) => ({ [locale]: msg })),
      ),
    )
      .then((values) => {
        const data = {};
        Object.assign(data, ...values);
        resolve(data as IMessages);
      })
      .catch((e: Error) => reject(e));
  });
