import type { ComponentType } from "react";
import type { Category } from "../lib/categories";
import { HomePage } from "../pages/home/HomePage";
import { MemoriesPage } from "../pages/memories/MemoriesPage";
import { GalleryPage } from "../pages/gallery/GalleryPage";
import { InfoPage } from "../pages/info/InfoPage";

export type RoutePath = "/" | "/memories" | "/gallery" | "/info";

export interface IRouteConfig {
  path: RoutePath;
  Page: ComponentType;
}

export const routes: IRouteConfig[] = [
  { path: "/", Page: HomePage },
  { path: "/memories", Page: MemoriesPage },
  { path: "/gallery", Page: GalleryPage },
  { path: "/info", Page: InfoPage },
];

export const CATEGORY_PATHS: Record<Category, RoutePath> = {
  HOME: "/",
  MEMORIES: "/memories",
  GALLERY: "/gallery",
  INFO: "/info",
};
