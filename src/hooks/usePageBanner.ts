import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type PageBannerKey = "memories" | "info";

const usePageBanner = (key: PageBannerKey) => {
  const [banner, setBannerState] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("page_banners")
      .select("image")
      .eq("key", key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled && !error) setBannerState(data?.image ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setBanner = async (image: string | null) => {
    const { error } = await supabase.from("page_banners").upsert({ key, image });
    if (error) {
      alert("Nie udało się zapisać tła sekcji.");
      return;
    }
    setBannerState(image);
  };

  return { banner, setBanner };
};

export { usePageBanner };
export type { PageBannerKey };
