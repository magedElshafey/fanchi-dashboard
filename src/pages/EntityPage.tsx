// src/pages/EntityPage.tsx
import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
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
  useEntityShow,
} from "../features/common/hooks";
import type { EntityRouteKey } from "../features/common/hooks";
import EntityForm from "./forms/EntityForm";
import { Skeleton } from "../components/ui/Skeleton";
import { useEntityList as useProductList } from "../features/common/hooks";
import type { Product } from "../types/entities";
import ExportExcelButton from "../components/ui/ExportExcelButton";
// ---------------------------------------------------------------------------
// Entity label map
// ---------------------------------------------------------------------------

export type EntityKey = EntityRouteKey;

const ENTITY_LABEL: Record<EntityKey, string> = {
  productCodes: "nav.hero",
  products: "nav.products",
  codeBatches: "nav.codeBatches",
  verifications: "nav.verifications",
  countries: "nav.countries",
  cities: "nav.cities",
  roles: "nav.roles",
  fetch_all_permissions: "nav.fetch_all_permissions",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(value: string | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EntityPage({
  entity,
  hasEdit = true,
  hasExcel = false,
  excelEndPoint = "",
}: {
  entity: EntityKey;
  hasEdit?: boolean;
  hasExcel?: boolean;
  excelEndPoint?: string;
}) {
  const { t } = useTranslation();
  const [sp, setSp] = useSearchParams();
  const { page, pageSize, q } = parsePagination(sp, { pageSize: 10 });

  // List query
  const query = useEntityList<Record<string, unknown>>(entity, {
    page,
    per_page: pageSize,
    q,
  });

  // Mutations
  const createMut = useEntityCreate<Record<string, unknown>>(entity);
  const updateMut = useEntityUpdate<Record<string, unknown>>(entity);
  const deleteMut = useEntityDelete(entity);

  // Form / edit state
  // BUG FIX: previously `editingId` could be null while `open` was true,
  // making the form panel appear with no data. Now we use a single `formState`
  // object so open+editing are always in sync.
  const [formState, setFormState] = useState<{
    open: boolean;
    editingId: string | null;
  }>({ open: false, editingId: null });

  const showQuery = useEntityShow<Record<string, unknown>>(
    entity,
    formState.editingId ?? undefined,
  );

  // Products list for codeBatch form dropdown — only fetched when needed
  const productsQuery = useProductList<Product>("products", { per_page: 400 });
  const countriesQuery = useEntityList<any>("countries", { per_page: 400 });
  const permessionsQuery = useEntityList<any>("fetch_all_permissions", {
    per_page: 400,
  });

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const openCreate = useCallback(() => {
    setFormState({ open: true, editingId: null });
  }, []);

  const openEdit = useCallback((id: string) => {
    setFormState({ open: true, editingId: id });
  }, []);

  const closeForm = useCallback(() => {
    setFormState({ open: false, editingId: null });
  }, []);

  const onSearchChange = useCallback(
    (nextQ: string) => {
      setSp(setParam(setParam(sp, "q", nextQ), "page", 1));
    },
    [sp, setSp],
  );

  const onPageChange = useCallback(
    (nextPage: number) => {
      setSp(setParam(sp, "page", nextPage));
    },
    [sp, setSp],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = confirm(t("app.confirmDelete"));
      if (!ok) return;
      try {
        await deleteMut.mutateAsync(id);
        toast.success(t("app.deleteSuccess"));
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : t("app.error"));
      }
    },
    [deleteMut, t],
  );

  const handleSubmit = useCallback(
    async (payload: Record<string, unknown>) => {
      try {
        if (formState.editingId) {
          await updateMut.mutateAsync({ id: formState.editingId, payload });
          toast.success(t("app.editSuccess"));
        } else {
          await createMut.mutateAsync(payload);
          toast.success(t("app.addSuccess"));
        }
        closeForm();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : t("app.error"));
      }
    },
    [formState.editingId, updateMut, createMut, closeForm, t],
  );

  // ---------------------------------------------------------------------------
  // Columns
  // BUG FIX: `productCodes` was missing `...common` — edit/delete never showed.
  // BUG FIX: `products` had two columns with header `t("form.expired")` — the
  //   second (category) is now correctly labeled.
  // ---------------------------------------------------------------------------

  const actionColumn = useMemo<ColumnDef<Record<string, unknown>>>(
    () => ({
      id: "actions",
      header: t("app.actions"),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => openEdit(item.id as string)}
              leftIcon={<Pencil className="w-4 h-4" />}
            >
              {t("app.edit")}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => handleDelete(item.id as string)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              {t("app.delete")}
            </Button>
          </div>
        );
      },
    }),
    [t, openEdit, handleDelete],
  );

  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (entity === "productCodes") {
      return [
        { header: t("form.title"), accessorKey: "name" },
        { header: t("generate.code"), accessorKey: "code" },
        {
          header: t("form.manufacturing_date"),
          accessorKey: "manufacturing_date",
          cell: ({ getValue }) => formatDate(getValue<string>()),
        },
        {
          header: t("form.expire_date"),
          accessorKey: "expire_date",
          cell: ({ getValue }) => formatDate(getValue<string>()),
        },
        // BUG FIX: productCodes had no action column — added it
        ...(hasEdit ? [actionColumn] : []),
      ];
    }

    if (entity === "products") {
      return [
        { header: t("form.title"), accessorKey: "name" },
        { header: t("form.warranty_months"), accessorKey: "warranty_months" },
        { header: t("form.sku"), accessorKey: "sku" },
        { header: t("form.prefix"), accessorKey: "prefix" },
        // BUG FIX: was t("form.expired") — now correctly labeled
        { header: t("form.category"), accessorKey: "category" },
        actionColumn,
      ];
    }

    if (entity === "codeBatches") {
      return [
        { header: t("form.batch_number"), accessorKey: "batch_number" },
        { header: t("form.quantity"), accessorKey: "quantity" },
        { header: t("form.used_count"), accessorKey: "used_count" },
        {
          header: t("form.manufacturing_date"),
          accessorKey: "manufacturing_date",
          cell: ({ getValue }) => formatDate(getValue<string>()),
        },
        {
          header: t("form.expire_date"),
          accessorKey: "expire_date",
          cell: ({ getValue }) => formatDate(getValue<string>()),
        },
        { header: t("form.year"), accessorKey: "year" },
        actionColumn,
      ];
    }
    if (entity === "verifications") {
      return [
        { header: t("form.dealer_name"), accessorKey: "dealer_name" },
        { header: t("form.entered_code"), accessorKey: "entered_code" },

        { header: t("form.productName"), accessorKey: "product_code.name" },

        {
          header: t("form.manufacturing_date"),
          accessorKey: "product_code.manufacturing_date",
          cell: ({ getValue }) => formatDate(getValue<string>()),
        },
        {
          header: t("form.expire_date"),
          accessorKey: "product_code.expire_date",
          cell: ({ getValue }) => formatDate(getValue<string>()),
        },
        { header: t("form.userName"), accessorKey: "user.name" },
        { header: t("form.userEmail"), accessorKey: "user.email" },
        { header: t("form.userPhone"), accessorKey: "user.phone" },
        { header: t("form.carBrand"), accessorKey: "vehicle.car_brand" },
        { header: t("form.carModel"), accessorKey: "vehicle.car_model" },
      ];
    }
    if (entity === "countries") {
      return [
        { header: t("form.countryName"), accessorKey: "name" },
        actionColumn,
      ];
    }
    if (entity === "cities") {
      return [
        { header: t("form.cityName"), accessorKey: "name" },
        { header: t("form.countryName"), accessorKey: "country.name" },
        actionColumn,
      ];
    }
    if (entity === "roles") {
      return [
        { header: t("form.roleName"), accessorKey: "name" },
        actionColumn,
      ];
    }
    if (entity === "fetch_all_permissions") {
      return [
        { header: t("form.permessionName"), accessorKey: "name" },
        actionColumn,
      ];
    }
    // SEO fallback
    return [
      { header: t("settings.key"), accessorKey: "key" },
      { header: t("settings.title"), accessorKey: "title" },
      {
        header: t("form.isActive"),
        accessorKey: "isActive",
        cell: ({ getValue }) => (getValue() ? "✓" : "—"),
      },
      actionColumn,
    ];
  }, [entity, t, actionColumn, hasEdit]);

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const title = t(ENTITY_LABEL[entity] ?? entity);

  // When editing, wait for the show query to resolve before rendering the form
  const isFormDataReady =
    !formState.editingId || (!showQuery.isLoading && !!showQuery.data);

  const formInitial = formState.editingId
    ? (showQuery.data?.data as Record<string, unknown> | undefined)
    : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 card">
        <div className="min-w-[260px]">
          <Input
            value={q}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("app.search")}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Export */}
          {hasExcel && (
            <ExportExcelButton
              endpoint={excelEndPoint}
              fileName="users.xlsx"
              label={t("app.export_excel")}
            />
          )}

          {/* Add */}
          {hasEdit && (
            <Button
              type="button"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openCreate}
            >
              {t("app.add")} {title}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      {query.isLoading ? (
        <div className="p-4 space-y-3 card">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      ) : (
        <DataTable
          data={query.data?.items ?? []}
          columns={columns}
          total={query.data?.total ?? 0}
          page={query.data?.page ?? page}
          pageSize={query.data?.pageSize ?? pageSize}
          onPageChange={onPageChange}
          loading={query.isFetching}
          empty={t("app.noResults")}
        />
      )}

      {/* Form panel */}
      {formState.open && hasEdit && (
        <div className="p-4 card">
          <div className="flex items-center justify-between">
            <div className="text-lg font-black">
              {formState.editingId ? t("app.edit") : t("app.add")} • {title}
            </div>
            <Button type="button" variant="ghost" onClick={closeForm}>
              ✕
            </Button>
          </div>
          <div className="my-3 divider" />

          {!isFormDataReady ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-32 h-10" />
            </div>
          ) : (
            // Only render for entities that have forms
            (entity === "products" ||
              entity === "codeBatches" ||
              entity === "countries" ||
              entity === "cities" ||
              entity === "roles" ||
              entity === "fetch_all_permissions") && (
              <EntityForm
                entity={entity}
                initial={formInitial as never}
                loading={createMut.isPending || updateMut.isPending}
                onCancel={closeForm}
                onSubmit={handleSubmit as never}
                products={
                  entity === "codeBatches"
                    ? productsQuery.data?.items
                    : undefined
                }
                countries={
                  entity === "cities" ? countriesQuery.data?.items : undefined
                }
                permessions={
                  entity === "roles" ? permessionsQuery.data?.items : undefined
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
