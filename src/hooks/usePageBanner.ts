import { useIntl } from "react-intl";
import { supabase } from "../lib/supabaseClient";
import { useCachedResource } from "./useCachedResource";
import { useLocale } from "../i18n/LocaleContext";
import type { SupportedLocale } from "../i18n/utils";

type PageBannerKey = "memories" | "info";

const LOCALE_SUFFIXES: Record<SupportedLocale, "pl" | "en" | "de"> = {
  "pl-PL": "pl",
  "en-GB": "en",
  "de-DE": "de",
};

interface IPageBannerDescriptions {
  description_pl: string | null;
  description_en: string | null;
  description_de: string | null;
}

interface IPageBannerData extends IPageBannerDescriptions {
  image: string | null;
}

const usePageBanner = (key: PageBannerKey) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const [data, writeData] = useCachedResource<IPageBannerData>(
    `page-banner:${key}`,
    async () => {
      const { data, error } = await supabase
        .from("page_banners")
        .select("image, description_pl, description_en, description_de")
        .eq("key", key)
        .maybeSingle();
      if (error) return undefined;
      return {
        image: data?.image ?? null,
        description_pl: data?.description_pl ?? null,
        description_en: data?.description_en ?? null,
        description_de: data?.description_de ?? null,
      };
    },
  );

  const save = async (next: IPageBannerData) => {
    const { error } = await supabase.from("page_banners").upsert({ key, ...next });
    if (error) {
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
