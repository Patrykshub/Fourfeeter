import { useIntl } from "react-intl";
import { supabase } from "../lib/supabaseClient";
import { useCachedResource } from "./useCachedResource";

type PageBannerKey = "memories" | "info";

interface IPageBannerData {
  image: string | null;
  description: string | null;
}

const usePageBanner = (key: PageBannerKey) => {
  const intl = useIntl();
  const [data, writeData] = useCachedResource<IPageBannerData>(
    `page-banner:${key}`,
    async () => {
      const { data, error } = await supabase
        .from("page_banners")
        .select("image, description")
        .eq("key", key)
        .maybeSingle();
      if (error) return undefined;
      return { image: data?.image ?? null, description: data?.description ?? null };
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
  const description = data?.description ?? null;

  const setBanner = (image: string | null) => save({ image, description });
  const setDescription = (nextDescription: string | null) => save({ image: banner, description: nextDescription });

  return { banner, setBanner, description, setDescription };
};

export { usePageBanner };
export type { PageBannerKey };
