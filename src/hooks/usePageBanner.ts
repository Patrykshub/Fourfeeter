import { useIntl } from "react-intl";
import { app } from "../model/Application";
import { useCachedResource } from "./useCachedResource";
import { useLocale } from "../i18n/LocaleContext";
import type { SupportedLocale } from "../i18n/utils";
import type { IPageBannerData, IPageBannerDescriptions, PageBannerKey } from "../model/services/PageBannerService";

const LOCALE_SUFFIXES: Record<SupportedLocale, "pl" | "en" | "de"> = {
  "pl-PL": "pl",
  "en-GB": "en",
  "de-DE": "de",
};

const usePageBanner = (key: PageBannerKey) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const [data, writeData] = useCachedResource<IPageBannerData>(
    `page-banner:${key}`,
    () => app().pageBanner.fetchBanner(key),
  );

  const save = async (next: IPageBannerData) => {
    const success = await app().pageBanner.saveBanner(key, next);
    if (!success) {
      alert(intl.formatMessage({ id: "pageBanner.saveError" }));
      return;
    }
    writeData(next);
  };

  const banner = data?.image ?? null;
  const descriptions: IPageBannerDescriptions = {
    description_pl: data?.description_pl ?? null,
    description_en: data?.description_en ?? null,
    description_de: data?.description_de ?? null,
  };
  const description = descriptions[`description_${LOCALE_SUFFIXES[locale]}`];

  const setBanner = (image: string | null) => save({ image, ...descriptions });
  const setDescriptions = (next: IPageBannerDescriptions) => save({ image: banner, ...next });

  return { banner, setBanner, description, descriptions, setDescriptions };
};

export { usePageBanner };
export type { PageBannerKey, IPageBannerDescriptions };
