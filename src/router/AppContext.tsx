import { createContext, useContext } from "react";
import type { IPost } from "../types";
import type { IPostDisplay } from "../lib/postLocalization";

interface IAppContextValue {
  posts: IPostDisplay[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (post: IPost) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const AppContext = createContext<IAppContextValue | null>(null);

export const useAppContext = (): IAppContextValue => {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useAppContext must be used within RootLayout");
  }
  return value;
};

export type { IAppContextValue };
