import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "../../lib/axios/Axios";

//
// ========================
// TYPES
// ========================
//
export const entityRoutes = {
  productCodes: "/dashboard/product-codes",
  products: "/dashboard/products",
  codeBatches: "/dashboard/code-batches",
};
function getEntityRoute(entity: keyof typeof entityRoutes) {
  return entityRoutes[entity];
}
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

//
// ========================
// QUERY KEYS
// ========================
//

export const queryKeys = {
  entity: (entity: string, params?: ListParams) =>
    ["entity", entity, params] as const,

  settings: (key: string) => ["settings", key] as const,

  kpi: () => ["kpi-stats"] as const,
};

//
// ========================
// HELPERS
// ========================
//

async function getPaginatedList<T>(
  entity: keyof typeof entityRoutes,
  params: ListParams,
) {
  const res = await Axios.get<PaginatedResponse<T>>(getEntityRoute(entity), {
    params,
  });

  return {
    items: res.data.data,
    total: res.data.meta.total,
    page: res.data.meta.current_page,
    pageSize: res.data.meta.per_page,
    lastPage: res.data.meta.last_page,
  };
}

//
// ========================
// KPI
// ========================
//

export function useKpiStats() {
  return useQuery({
    queryKey: queryKeys.kpi(),
    queryFn: async () => {
      const res = await Axios.get("/stats");
      return res.data;
    },
  });
}

//
// ========================
// ENTITY LIST
// ========================
//

export function useEntityList<T>(
  entity: keyof typeof entityRoutes,
  params: ListParams,
) {
  return useQuery({
    queryKey: queryKeys.entity(entity, params),

    queryFn: () => getPaginatedList<T>(entity, params),

    placeholderData: (prev) => prev,
  });
}

//
// ========================
// CREATE
// ========================
//

export function useEntityCreate<T>(entity: keyof typeof entityRoutes) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<T>) => {
      const res = await Axios.post(getEntityRoute(entity), payload);

      return res.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["entity", entity],
      });
    },
  });
}

//
// ========================
// UPDATE
// ========================
//

export function useEntityUpdate<T>(entity: keyof typeof entityRoutes) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<T>;
    }) => {
      const res = await Axios.put(`${getEntityRoute(entity)}/${id}`, payload);

      return res.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["entity", entity],
      });
    },
  });
}

//
// ========================
// DELETE
// ========================
//

export function useEntityDelete(entity: keyof typeof entityRoutes) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await Axios.delete(`${getEntityRoute(entity)}/${id}`);

      return res.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["entity", entity],
      });
    },
  });
}

//
// ========================
// SETTINGS
// ========================
//

export function useSettings<T>(key: "site" | "contact") {
  return useQuery<T>({
    queryKey: queryKeys.settings(key),

    queryFn: async () => {
      const res = await Axios.get(`/settings/${key}`);

      return res.data;
    },
  });
}

export function useUpdateSettings<T>(key: "site" | "contact") {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<T>) => {
      const res = await Axios.put(`/settings/${key}`, payload);

      return res.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.settings(key),
      });
    },
  });
}
