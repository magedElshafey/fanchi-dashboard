import React, { useMemo, useRef } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "../../lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";
import i18n from "../../i18n";

export type DataTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  empty?: React.ReactNode;
  loading?: boolean;
};

export default function DataTable<T extends object>({
  data,
  columns,
  total,
  page,
  pageSize,
  onPageChange,

  empty,
  loading,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const parentRef = useRef<HTMLDivElement | null>(null);

  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const footerText = useMemo(() => {
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(total, page * pageSize);
    return `${start}-${end} / ${total}`;
  }, [page, pageSize, total]);

  return (
    <div className="p-3 card">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${table.getAllColumns().length}, minmax(0, 1fr))`,
          }}
        >
          {table.getHeaderGroups().map((hg) =>
            hg.headers.map((h) => (
              <div
                key={h.id}
                className="px-3 py-2 text-xs font-semibold tracking-wide uppercase"
                style={{
                  background: "rgba(255,255,255,.04)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {flexRender(h.column.columnDef.header, h.getContext())}
              </div>
            )),
          )}
        </div>

        <div
          ref={parentRef}
          className={cn("scrollbar max-h-[520px] overflow-auto")}
          style={{ background: "rgba(0,0,0,.02)" }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rows.length === 0 && !loading ? (
              <div className="p-6 text-sm opacity-80">{empty ?? "No rows"}</div>
            ) : null}

            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <div
                  key={row.id}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: `repeat(${table.getAllColumns().length}, minmax(0, 1fr))`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className="px-3 py-2 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
        <div className="help">{footerText}</div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            leftIcon={
              i18n.language === "en" ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            }
          >
            Prev
          </Button>

          <div className="px-2 text-sm font-semibold">
            {page} / {pageCount}
          </div>

          <Button
            type="button"
            onClick={() => onPageChange(Math.min(pageCount, page + 1))}
            disabled={page >= pageCount}
            rightIcon={
              i18n.language === "en" ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
