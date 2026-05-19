// src/features/common/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "../../lib/axios/Axios";

// ========================
// ROUTES
// ========================

export const entityRoutes = {
  productCodes: "/dashboard/product-codes",
  products: "/dashboard/products",
  codeBatches: "/dashboard/code-batches",
  verifications: "/dashboard/verifications",
  countries: "/dashboard/countries",
  cities: "/dashboard/cities",
  roles: "/dashboard/roles",
} as const;

export type EntityRouteKey = keyof typeof entityRoutes;

function getEntityRoute(entity: EntityRouteKey): string {
  return entityRoutes[entity];
}

// ========================
// TYPES
// ========================

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    from: number;
    to: number;
    count: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

export type ListParams = {
  page?: number;
  per_page?: number;
  q?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: number;
};

// ========================
// QUERY KEYS
// ========================

export const queryKeys = {
  entityList: (entity: string, params?: ListParams) =>
    ["entity-list", entity, params] as const,

  // BUG FIX: separate namespace to avoid colliding with list keys when id=""
  entityShow: (entity: string, id: string) =>
    ["entity-show", entity, id] as const,

  settings: (key: string) => ["settings", key] as const,

  kpi: () => ["kpi-stats"] as const,
};

// ========================
// HELPERS
// ========================

async function getPaginatedList<T>(
  entity: EntityRouteKey,
  params: ListParams,
): Promise<PaginatedResult<T>> {
  const res = await Axios.get<PaginatedResponse<T>>(getEntityRoute(entity), {
    params,
  });

  // BUG FIX: defensive null access — API shape may not always match
  const meta = res.data?.meta;
  return {
    items: res.data?.data ?? [],
    total: meta?.total ?? 0,
    page: meta?.current_page ?? 1,
    pageSize: meta?.per_page ?? 10,
    lastPage: meta?.last_page ?? 1,
  };
}

// ========================
// KPI
// ========================

export function useKpiStats() {
  return useQuery({
    queryKey: queryKeys.kpi(),
    queryFn: async () => {
      const res = await Axios.get("/stats");
      return res.data;
    },
  });
}

// ========================
// ENTITY LIST
// ========================

export function useEntityList<T>(entity: EntityRouteKey, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.entityList(entity, params),
    queryFn: () => getPaginatedList<T>(entity, params),
    placeholderData: (prev) => prev,
  });
}

// ========================
// ENTITY SHOW
// ========================

// BUG FIX: API wraps the item in { data: T }, typed correctly here
export type ShowResponse<T> = { data: T };

export function useEntityShow<T>(entity: EntityRouteKey, id?: string) {
  return useQuery<ShowResponse<T>>({
    // BUG FIX: use "entity-show" namespace so key never clashes with list keys
    queryKey: queryKeys.entityShow(entity, id ?? ""),
    queryFn: async (): Promise<ShowResponse<T>> => {
      const res = await Axios.get<ShowResponse<T>>(
        `${getEntityRoute(entity)}/${id}`,
      );
      return res.data;
    },
    enabled: !!id,
  });
}

// ========================
// CREATE
// ========================

export function useEntityCreate<T>(entity: EntityRouteKey) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<T>) => {
      const res = await Axios.post<T>(getEntityRoute(entity), payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entity-list", entity] });
    },
  });
}

// ========================
// UPDATE
// ========================

// export function useEntityUpdate<T>(entity: EntityRouteKey) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: Partial<T>;
//     }) => {
//       const res = await Axios.put<T>(
//         `${getEntityRoute(entity)}/${id}`,
//         payload,
//       );
//       return res.data;
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["entity-list", entity] });
//       qc.invalidateQueries({
//         queryKey: queryKeys.entityShow(entity, id ?? ""),
//       });
//     },
//   });
// }
export function useEntityUpdate<T>(entity: EntityRouteKey) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<T>;
    }) => {
      const res = await Axios.put<T>(
        `${getEntityRoute(entity)}/${id}`,
        payload,
      );

      return res.data;
    },

    onSuccess: (_, variables) => {
      // revalidate list
      qc.invalidateQueries({
        queryKey: ["entity-list", entity],
      });

      // revalidate show
      qc.invalidateQueries({
        queryKey: queryKeys.entityShow(entity, variables.id),
      });
    },
  });
}
// ========================
// DELETE
// ========================

export function useEntityDelete(entity: EntityRouteKey) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await Axios.delete(`${getEntityRoute(entity)}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entity-list", entity] });
    },
  });
}

// ========================
// SETTINGS
// ========================

export function useSettings<T>(key: "site" | "contact") {
  return useQuery<T>({
    queryKey: queryKeys.settings(key),
    queryFn: async () => {
      const res = await Axios.get<T>(`/settings/${key}`);
      return res.data;
    },
  });
}

export function useUpdateSettings<T>(key: "site" | "contact") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<T>) => {
      const res = await Axios.put<T>(`/settings/${key}`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.settings(key) });
    },
  });
}
