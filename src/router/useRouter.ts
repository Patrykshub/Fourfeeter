import { useEffect, useState } from "react";

interface INavigationState {
  pathname: string;
  search: string;
}

const NAVIGATE_EVENT = "app:navigate";

const getNavigationState = (): INavigationState => ({
  pathname: window.location.pathname,
  search: window.location.search,
});

const navigate = (path: string): void => {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
};

const useRouter = () => {
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

export { useRouter, navigate };
