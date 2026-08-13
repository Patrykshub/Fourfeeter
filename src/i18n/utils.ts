// based on https://github.com/formatjs/formatjs/blob/main/packages/react-intl/examples/StaticTypeSafetyAndCodeSplitting/intlHelpers.tsx

import sourceOfTruth from "../lang/pl-PL.json";

export type LocaleMessages = typeof sourceOfTruth;
export type LocaleKey = Extract<keyof LocaleMessages, string>;
export type SupportedLocale = "pl-PL" | "en-GB" | "de-DE";

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  "pl-PL": "PL",
  "en-GB": "EN",
  "de-DE": "DE",
};

export type IMessages = {
  [key in SupportedLocale]: LocaleMessages;
};

export const importMessages = (
  locale: SupportedLocale,
): Promise<LocaleMessages> => {
  switch (locale) {
    case "pl-PL":
      return import("../lang/pl-PL.json").then((m) => m.default);
    case "en-GB":
      return import("../lang/en-GB.json").then((m) => m.default);
    case "de-DE":
      return import("../lang/de-DE.json").then((m) => m.default);
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
