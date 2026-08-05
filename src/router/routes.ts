import type { ComponentType } from "react";
import type { Category } from "../components/CategorySelect";
import { HomePage } from "../pages/home/HomePage";
import { MemoriesPage } from "../pages/memories/MemoriesPage";
import { InfoPage } from "../pages/info/InfoPage";

type RoutePath = "/" | "/memories" | "/info";

interface IRouteConfig {
  path: RoutePath;
  Page: ComponentType;
}

const routes: IRouteConfig[] = [
  { path: "/", Page: HomePage },
  { path: "/memories", Page: MemoriesPage },
  { path: "/info", Page: InfoPage },
];

const CATEGORY_PATHS: Record<Category, RoutePath> = {
  HOME: "/",
  MEMORIES: "/memories",
  INFO: "/info",
};

export { routes, CATEGORY_PATHS };
export type { RoutePath, IRouteConfig };
