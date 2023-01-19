import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import Home from "./pages/home";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/game",
    component: lazy(() => import("./pages/game"))
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
