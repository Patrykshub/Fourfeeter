import { createContext, useContext } from "react";
import type { IPost } from "../types";

interface IAppContextValue {
  posts: IPost[];
  isAdmin: boolean;
  onEdit: (post: IPost) => void;
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
