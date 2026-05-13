import { lazyLoad } from "../utils/LazyLoad";
import type { RouteObject } from "react-router-dom";
import Guard from "./Guard";

export const websiteRoutes: RouteObject = {
  element: lazyLoad(() => import("../components/layout/DashboardLayout")),

  children: [
    {
      element: (
        <Guard requireAuth>
          {lazyLoad(() => import("../pages/DashboardHome"))}
        </Guard>
      ),
      index: true,
    },
  ],
};
