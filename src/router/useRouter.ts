import { useEffect, useState } from "react";

export interface INavigationState {
  pathname: string;
  search: string;
}

const NAVIGATE_EVENT = "app:navigate";

// Vite's configured base path (e.g. "/Fourfeeter/" on GitHub Pages, "/" in dev).
// Route paths throughout the app (routes.ts, CATEGORY_PATHS) are always base-relative,
// so the real browser pathname must be stripped down to/built back up from that base.
const BASE_PATH = import.meta.env.BASE_URL;

const stripBase = (pathname: string): string => {
  if (!pathname.startsWith(BASE_PATH)) return pathname;
  const rest = pathname.slice(BASE_PATH.length);
  return rest ? `/${rest}` : "/";
};

const withBase = (path: string): string => `${BASE_PATH}${path.slice(1)}`;

const getNavigationState = (): INavigationState => ({
  pathname: stripBase(window.location.pathname),
  search: window.location.search,
});

export const navigate = (path: string): void => {
  window.history.pushState(null, "", withBase(path));
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
};

export const useRouter = () => {
  const [state, setState] = useState<INavigationState>(getNavigationState);

  useEffect(() => {
    const handleChange = () => setState(getNavigationState());
    window.addEventListener("popstate", handleChange);
    window.addEventListener(NAVIGATE_EVENT, handleChange);
    return () => {
      window.removeEventListener("popstate", handleChange);
      window.removeEventListener(NAVIGATE_EVENT, handleChange);
    };
  }, []);

  return { ...state, navigate };
};
