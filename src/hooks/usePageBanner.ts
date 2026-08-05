import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../lib/storage";

type PageBannerKey = "memories" | "info";

const storageKeyFor = (key: PageBannerKey): string => `banner_v1_${key}`;

const usePageBanner = (key: PageBannerKey) => {
  const storageKey = storageKeyFor(key);
  const [banner, setBanner] = useState<string | null>(() =>
    readJSON<string | null>(storageKey, null),
  );

  useEffect(() => {
    const didSave = writeJSON(storageKey, banner);
    if (!didSave) {
      alert("Nie udało się zapisać tła — zdjęcie jest zbyt duże dla local storage przeglądarki.");
    }
  }, [banner, storageKey]);

  return { banner, setBanner };
};

export { usePageBanner };
export type { PageBannerKey };
