import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";

import DataTable from "../components/ui/DataTable";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { parsePagination, setParam } from "../lib/pagination";
import {
  useEntityCreate,
  useEntityDelete,
  useEntityList,
  useEntityUpdate,
} from "../features/common/hooks";
import EntityForm from "./forms/EntityForm";

import { Skeleton } from "../components/ui/Skeleton";

type EntityKey = "hero" | "stats";

const ENTITY_LABEL: Record<EntityKey, string> = {
  hero: "nav.hero",
  stats: "nav.stats",
};

export default function EntityPage({
  entity,
  hasEdit,
}: {
  entity: EntityKey;
  hasEdit: boolean;
}) {
  const { t } = useTranslation();
  const [sp, setSp] = useSearchParams();
  const { page, pageSize, q } = parsePagination(sp, { pageSize: 10 });

  const query = useEntityList<any>(entity, page, pageSize, q);
  const createMut = useEntityCreate<any>(entity);
  const updateMut = useEntityUpdate<any>(entity);
  const deleteMut = useEntityDelete(entity);

  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  function onSearchChange(nextQ: string) {
    setSp(setParam(setParam(sp, "q", nextQ), "page", 1));
  }

  function onPageChange(nextPage: number) {
    setSp(setParam(sp, "page", nextPage));
  }

  const columns = useMemo<ColumnDef<any, any>[]>(() => {
    const common: ColumnDef<any, any>[] = [
      {
        header: t("app.actions"),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditing(item);
                  setOpen(true);
                }}
                leftIcon={<Pencil className="w-4 h-4" />}
              >
                {t("app.edit")}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={async () => {
                  const ok = confirm(t("app.confirmDelete"));
                  if (!ok) return;
                  try {
                    await deleteMut.mutateAsync(item.id);
                    toast.success(t("app.delete"));
                  } catch (e: any) {
                    toast.error(e?.message ?? "Failed");
                  }
                }}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                {t("app.delete")}
              </Button>
            </div>
          );
        },
      },
    ];

    if (entity === "hero") {
      return [
        { header: t("form.title"), accessorKey: "title" },
        { header: t("form.subtitle"), accessorKey: "subtitle" },
      ];
    }
    if (entity === "stats") {
      return [
        { header: t("date&time"), accessorKey: "title" },
        { header: t("customer"), accessorKey: "value" },
        {
          header: t("phone"),
          accessorKey: "trend",
        },
        {
          header: t("vehicle"),
          accessorKey: "trend",
        },
        {
          header: t("code"),
          accessorKey: "trend",
        },
      ];
    }

    // seo
    return [
      { header: t("settings.key"), accessorKey: "key" },
      { header: t("settings.title"), accessorKey: "title" },
      {
        header: t("form.isActive"),
        accessorKey: "isActive",
        cell: ({ getValue }) => (getValue() ? "✓" : "—"),
      },
      ...common,
    ];
  }, [entity, t, deleteMut]);

  const title = t(ENTITY_LABEL[entity]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 card">
        <div className="min-w-[260px]">
          <Input
            value={q}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("app.search")}
          />
        </div>
        {hasEdit && (
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            {t("app.add")} {title}
          </Button>
        )}
      </div>

      {query.isLoading ? (
        <div className="p-4 space-y-3 card">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      ) : (
        <DataTable
          data={query?.data?.items ?? []}
          columns={columns}
          total={query.data?.total ?? 0}
          page={query.data?.page ?? page}
          pageSize={query.data?.pageSize ?? pageSize}
          onPageChange={onPageChange}
          loading={query.isFetching}
          empty={t("app.noResults")}
        />
      )}

      {open && hasEdit ? (
        <div className="p-4 card">
          <div className="flex items-center justify-between">
            <div className="text-lg font-black">
              {editing ? t("app.edit") : t("app.add")} • {title}
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              ✕
            </Button>
          </div>
          <div className="my-3 divider" />
          <EntityForm
            entity={entity}
            initial={editing}
            loading={createMut.isPending || updateMut.isPending}
            onCancel={() => setOpen(false)}
            onSubmit={async (payload) => {
              try {
                if (editing) {
                  await updateMut.mutateAsync({ id: editing.id, payload });
                  toast.success(t("app.edit"));
                } else {
                  await createMut.mutateAsync(payload);
                  toast.success(t("app.add"));
                }
                setOpen(false);
              } catch (e: any) {
                toast.error(e?.message ?? "Failed");
              }
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
