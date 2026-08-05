import { createContext, useContext } from "react";
import type { Post } from "../types";

interface IAppContextValue {
  posts: Post[];
  isAdmin: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const AppContext = createContext<IAppContextValue | null>(null);

const useAppContext = (): IAppContextValue => {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useAppContext must be used within RootLayout");
  }
  return value;
};

export { AppContext, useAppContext };
export type { IAppContextValue };
