import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { ListResponse } from "../../types/entities";

export function useKpiStats() {
  return useQuery({
    queryKey: ["kpi-stats"],
    queryFn: async () => (await api.get("/stats")).data,
  });
}

export function useEntityList<T>(entity: string, page: number, pageSize: number, q: string) {
  return useQuery<ListResponse<T>>({
    queryKey: ["entity", entity, page, pageSize, q],
    queryFn: async () => (await api.get("/entity", { params: { entity, page, pageSize, q } })).data,
    keepPreviousData: true,
  });
}

export function useEntityCreate<T>(entity: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<T>) => (await api.post("/entity", { entity, payload })).data as T,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entity", entity] });
    },
  });
}

export function useEntityUpdate<T>(entity: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<T> }) =>
      (await api.put(`/entity/${id}`, { entity, payload })).data as T,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entity", entity] });
    },
  });
}

export function useEntityDelete(entity: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/entity/${id}`, { params: { entity } })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entity", entity] });
    },
  });
}

export function useSettings<T>(key: "site" | "contact") {
  return useQuery<T>({
    queryKey: ["settings", key],
    queryFn: async () => (await api.get(`/settings/${key}`)).data,
  });
}

export function useUpdateSettings<T>(key: "site" | "contact") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<T>) => (await api.put(`/settings/${key}`, payload)).data as T,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", key] }),
  });
}
