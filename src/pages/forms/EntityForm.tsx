import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import { Toggle } from "../../components/ui/Toggle";
import i18n from "../../i18n";
import type { EntityKey } from "../EntityPage";
import Select from "../../components/ui/Select";
const products = [
  {
    id: 1,
    name: "product 1",
  },
  {
    id: 2,
    name: "product 2",
  },
  {
    id: 3,
    name: "product 3",
  },
];
const t = i18n.t;

export const productSchema = () =>
  z.object({
    name: z.object({
      ar: z.string().min(3, t("validation.name_ar_min")),
      en: z.string().min(3, t("validation.name_en_min")),
    }),

    description: z.object({
      ar: z.string().min(10, t("validation.description_ar_min")),
      en: z.string().min(10, t("validation.description_en_min")),
    }),

    sku: z.string().min(1, t("validation.sku_required")),

    prefix: z
      .string()
      .trim()
      .min(1, t("validation.prefix_required"))
      .max(10, t("validation.prefix_max")),

    category: z.string().min(1, t("validation.category_required")),

    warranty_months: z.coerce
      .number({
        invalid_type_error: t("validation.warranty_number"),
      })
      .min(1, t("validation.warranty_positive")),

    is_active: z.union([z.literal(0), z.literal(1)], {
      errorMap: () => ({
        message: t("validation.is_active"),
      }),
    }),
  });
export type ProductSchemaType = z.infer<ReturnType<typeof productSchema>>;

export const codeBatchSchema = () =>
  z
    .object({
      batch_number: z
        .string()
        .trim()
        .min(3, t("validation.batch_number_min"))
        .max(50, t("validation.batch_number_max")),

      product_id: z.coerce.number({
        required_error: t("validation.product_required"),
        invalid_type_error: t("validation.product_required"),
      }),

      manufacturing_date: z
        .string()
        .min(1, t("validation.manufacturing_required")),

      expire_date: z.string().min(1, t("validation.expire_required")),

      year: z.coerce
        .number({
          invalid_type_error: t("validation.year_number"),
        })
        .min(2000, t("validation.year_min"))
        .max(2100, t("validation.year_max")),

      quantity: z.coerce
        .number({
          invalid_type_error: t("validation.quantity_number"),
        })
        .positive(t("validation.quantity_positive")),

      notes: z
        .object({
          ar: z
            .string()
            .max(1000, t("validation.notes_ar_max"))
            .optional()
            .or(z.literal("")),

          en: z
            .string()
            .max(1000, t("validation.notes_en_max"))
            .optional()
            .or(z.literal("")),
        })
        .optional(),

      is_active: z.union([z.literal(0), z.literal(1)], {
        errorMap: () => ({
          message: t("validation.is_active"),
        }),
      }),
    })
    .refine(
      (data) => new Date(data.expire_date) > new Date(data.manufacturing_date),
      {
        path: ["expire_date"],
        message: t("validation.expire_after_manufacturing"),
      },
    );
type CodeBatchSchemaType = z.infer<ReturnType<typeof codeBatchSchema>>;
type EntityMap = {
  products: ProductSchemaType;
  codeBatches: CodeBatchSchemaType;
};
type EntityFormProps<K extends keyof EntityMap> = {
  entity: K;

  initial?: Partial<EntityMap[K]> | null;

  onSubmit: (payload: EntityMap[K]) => Promise<void>;

  onCancel: () => void;

  loading?: boolean;
};

const getSchema = (entity: EntityKey) => {
  switch (entity) {
    case "products":
      return productSchema();
    case "codeBatches":
      return codeBatchSchema();
    default:
      return null;
  }
};

const getDefaultValues = <K extends keyof EntityMap>(
  entity: K,
  initial?: Partial<EntityMap[K]> | null,
) => {
  switch (entity) {
    case "products":
      return {
        name: {
          ar: initial?.name?.ar ?? "",
          en: initial?.name?.en ?? "",
        },

        description: {
          ar: initial?.description?.ar ?? "",
          en: initial?.description?.en ?? "",
        },

        sku: initial?.sku ?? "",
        prefix: initial?.prefix ?? "",
        category: initial?.category ?? "",
        warranty_months: initial?.warranty_months ?? 1,
        is_active: initial?.is_active ?? 1,
      };
    case "codeBatches":
      return {
        batch_number: initial?.batch_number ?? "",

        product_id: initial?.product_id ?? "",

        manufacturing_date: initial?.manufacturing_date ?? "",

        expire_date: initial?.expire_date ?? "",

        year: initial?.year ?? new Date().getFullYear(),

        quantity: initial?.quantity ?? 1,

        notes: {
          ar: initial?.notes?.ar ?? "",
          en: initial?.notes?.en ?? "",
        },

        is_active: initial?.is_active ?? 1,
      };
    default:
      return {
        isActive: initial?.is_active ?? true,
        key: "",
        title: "",
        description: "",
      };
  }
};

export default function EntityForm<K extends keyof EntityMap>({
  entity,
  initial,
  onSubmit,
  onCancel,
  loading = false,
}: EntityFormProps<K>) {
  const { t } = useTranslation();
  const schema = useMemo(() => getSchema(entity), [entity]);

  const defaultValues = useMemo(
    () => getDefaultValues(entity, initial),
    [entity, initial],
  );

  const form = useForm<EntityMap[K]>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as EntityMap[K],
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;
  useEffect(() => {
    reset(defaultValues as Partial<EntityMap[K]>);
  }, [defaultValues, reset]);
  const isActive = watch("is_active");

  const handleFormSubmit = async (values: EntityMap[K]) => {
    await onSubmit(values);
  };

  return (
    <>
      {entity === "products" && (
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Name AR"
              error={errors.name?.ar?.message}
              {...register("name.ar")}
            />

            <Input
              label="Name EN"
              error={errors.name?.en?.message}
              {...register("name.en")}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Textarea
              label="Description AR"
              error={errors.description?.ar?.message}
              {...register("description.ar")}
            />

            <Textarea
              label="Description EN"
              error={errors.description?.en?.message}
              {...register("description.en")}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="SKU"
              error={errors.sku?.message}
              {...register("sku")}
            />

            <Input
              label="Prefix"
              error={errors.prefix?.message}
              {...register("prefix")}
            />
          </div>

          <Input
            label="Category"
            error={errors.category?.message}
            {...register("category")}
          />

          <Input
            type="number"
            label="Warranty Months"
            error={errors.warranty_months?.message}
            {...register("warranty_months")}
          />

          <div className="flex items-center gap-3">
            <Toggle
              checked={isActive === 1}
              onChange={(next) => {
                setValue("is_active", next ? 1 : 0, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              label="Active"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 mt-6">
            <Button type="submit" variant="primary" loading={loading}>
              {t("app.save")}
            </Button>

            <Button type="button" onClick={onCancel}>
              {t("app.cancel")}
            </Button>
          </div>
        </form>
      )}
      {entity === "codeBatches" && (
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="form.batch_number"
              error={errors?.batch_number?.message}
              {...register("batch_number")}
            />
            {/* <Select
              label={t("form.product")}
              placeholder={t("form.select_product")}
              options={products.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              error={errors.product_id?.message}
              {...register("product_id", {
                valueAsNumber: true,
              })}
            /> */}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="date"
              label="form.expire"
              error={errors.expire_date?.message}
              {...register("expire_date")}
            />

            <Input
              type="date"
              label="form.manufactor"
              error={errors.manufacturing_date?.message}
              {...register("manufacturing_date")}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="number"
              label="form.year"
              error={errors.year?.message}
              {...register("year")}
            />
            <Input
              type="number"
              label="form.quantity"
              error={errors.quantity?.message}
              {...register("quantity")}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Textarea
              label="Notes AR"
              error={errors.notes?.ar?.message}
              {...register("notes.ar")}
            />

            <Textarea
              label="Notes EN"
              error={errors.notes?.en?.message}
              {...register("notes.en")}
            />
          </div>
          <div className="flex items-center gap-3">
            <Toggle
              checked={isActive === 1}
              onChange={(next) => {
                setValue("is_active", next ? 1 : 0, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              label="Active"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 mt-6">
            <Button type="submit" variant="primary" loading={loading}>
              {t("app.save")}
            </Button>

            <Button type="button" onClick={onCancel}>
              {t("app.cancel")}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
