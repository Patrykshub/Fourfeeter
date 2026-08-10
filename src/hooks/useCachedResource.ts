import { useEffect, useState } from "react";

const cache = new Map<string, unknown>();

// T must not itself be a function type, or writeCache misreads a plain
// value as an updater — same caveat as React's functional setState.
export const useCachedResource = <T,>(cacheKey: string, fetcher: () => Promise<T | undefined>) => {
  const [value, setValue] = useState<T | undefined>(() => cache.get(cacheKey) as T | undefined);

  useEffect(() => {
    if (cache.has(cacheKey)) return;

    let cancelled = false;
    fetcher().then((result) => {
      if (cancelled || result === undefined) return;
      cache.set(cacheKey, result);
      setValue(result);
    });
    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  const writeCache = (next: T | ((prev: T | undefined) => T)) => {
    const resolved =
      typeof next === "function"
        ? (next as (prev: T | undefined) => T)(cache.get(cacheKey) as T | undefined)
        : next;
    cache.set(cacheKey, resolved);
    setValue(resolved);
  };

  return [value, writeCache] as const;
};
