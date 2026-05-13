export type PaginationState = { page: number; pageSize: number; q: string };

export function parsePagination(searchParams: URLSearchParams, defaults?: Partial<PaginationState>): PaginationState {
  const page = Math.max(1, Number(searchParams.get("page") ?? defaults?.page ?? 1) || 1);
  const pageSize = Math.max(5, Number(searchParams.get("pageSize") ?? defaults?.pageSize ?? 10) || 10);
  const q = (searchParams.get("q") ?? defaults?.q ?? "").toString();
  return { page, pageSize, q };
}

export function setParam(searchParams: URLSearchParams, key: string, value: string | number | null | undefined) {
  const next = new URLSearchParams(searchParams);
  if (value === null || value === undefined || value === "" || (typeof value === "number" && Number.isNaN(value))) {
    next.delete(key);
  } else {
    next.set(key, String(value));
  }
  return next;
}
