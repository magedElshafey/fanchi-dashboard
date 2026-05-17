import { lazyLoad } from "../utils/LazyLoad";
import type { RouteObject } from "react-router-dom";
import Guard from "./Guard";
import { TransparentFallback } from "../utils/LazyLoad";
import { lazy, Suspense } from "react";
const EntityPage = lazy(() => import("../pages/EntityPage"));
export const websiteRoutes: RouteObject = {
  element: (
    <Guard requireAuth>
      {lazyLoad(() => import("../components/layout/DashboardLayout"))}
    </Guard>
  ),

  children: [
    {
      element: lazyLoad(() => import("../pages/DashboardHome")),

      index: true,
    },
    {
      element: (
        <Suspense fallback={<TransparentFallback />}>
          <EntityPage hasEdit={false} entity="productCodes" />,
        </Suspense>
      ),

      path: "generate-code",
    },
    {
      element: (
        <Suspense fallback={<TransparentFallback />}>
          <EntityPage hasEdit={true} entity="products" />,
        </Suspense>
      ),

      path: "products",
    },
    {
      element: (
        <Suspense fallback={<TransparentFallback />}>
          <EntityPage hasEdit={true} entity="codeBatches" />,
        </Suspense>
      ),

      path: "code-batches",
    },
  ],
};
