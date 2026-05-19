// src/routes/websiteRoutes.tsx
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import Guard from "./Guard";
import { lazyLoad, TransparentFallback } from "../utils/LazyLoad";

const EntityPage = lazy(() => import("../pages/EntityPage"));

// Helper to keep route definitions DRY
function entityRoute(
  path: string,
  entity:
    | "productCodes"
    | "products"
    | "codeBatches"
    | "verifications"
    | "countries"
    | "cities"
    | "roles"
    | "fetch_all_permissions",
  hasEdit: boolean = true,
  hasExcel: boolean = false,
  excelEndPoint: string = "",
): RouteObject {
  return {
    path,
    element: (
      <Suspense fallback={<TransparentFallback />}>
        {/* BUG FIX: trailing comma after self-closing JSX tag was a syntax error */}
        <EntityPage
          key={entity}
          hasEdit={hasEdit}
          entity={entity}
          hasExcel={hasExcel}
          excelEndPoint={excelEndPoint}
        />
      </Suspense>
    ),
  };
}

export const websiteRoutes: RouteObject = {
  element: (
    <Guard requireAuth>
      {lazyLoad(() => import("../components/layout/DashboardLayout"))}
    </Guard>
  ),
  children: [
    {
      index: true,
      element: lazyLoad(() => import("../pages/DashboardHome")),
    },
    entityRoute("generate-code", "productCodes", false),
    entityRoute("products", "products"),
    entityRoute("code-batches", "codeBatches"),
    entityRoute(
      "verifications",
      "verifications",
      false,
      true,
      "dashboard/users/export/link",
    ),
    entityRoute("countries", "countries"),
    entityRoute("cities", "cities"),
    entityRoute("fetch_all_permissions", "fetch_all_permissions"),
    entityRoute("roles", "roles"),
  ],
};
