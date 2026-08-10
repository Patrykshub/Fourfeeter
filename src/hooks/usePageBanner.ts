import { useIntl } from "react-intl";
import { supabase } from "../lib/supabaseClient";
import { useCachedResource } from "./useCachedResource";

type PageBannerKey = "memories" | "info";

const usePageBanner = (key: PageBannerKey) => {
  const intl = useIntl();
  const [banner, writeBanner] = useCachedResource<string | null>(
    `page-banner:${key}`,
    async () => {
      const { data, error } = await supabase
        .from("page_banners")
        .select("image")
        .eq("key", key)
        .maybeSingle();
      if (error) return undefined;
      return data?.image ?? null;
    },
  );

  const setBanner = async (image: string | null) => {
    const { error } = await supabase.from("page_banners").upsert({ key, image });
    if (error) {
      alert(intl.formatMessage({ id: "pageBanner.saveError" }));
      return;
    }
    writeBanner(image);
  };

  return { banner: banner ?? null, setBanner };
};

export { usePageBanner };
export type { PageBannerKey };
