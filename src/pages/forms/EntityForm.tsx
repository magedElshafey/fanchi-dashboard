import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import { Toggle } from "../../components/ui/Toggle";
import FileUploader, { FileValue } from "../../components/ui/FileUploader";
import RichTextEditor from "../../components/ui/RichTextEditor";
import i18n from "../../i18n";

type EntityKey = "products";

const base = z.object({
  isActive: z.boolean().default(true),
});

const seoSchema = base.extend({
  key: z.string().min(2),
  title: z.string().min(2),
  description: z.string().optional(),
});

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
      .min(1, t("validation.prefix_required"))
      .max(10, t("validation.prefix_max")),

    category: z.string().min(1, t("validation.category_required")),

    warranty_months: z.coerce
      .number({
        invalid_type_error: t("validation.warranty_number"),
      })
      .positive(t("validation.warranty_positive")),

    is_active: z.coerce.number().refine((val) => val === 0 || val === 1, {
      message: t("validation.is_active"),
    }),
  });

export type ProductSchemaType = z.infer<ReturnType<typeof productSchema>>;

function schemaFor(entity: EntityKey) {
  if (entity === "products") return productSchema;
  // if (entity === "stats") return statSchema;
  // if (entity === "testimonials") return testimonialSchema;
  // if (entity === "social") return socialSchema;
  return seoSchema;
}

export default function EntityForm({
  entity,
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  entity: EntityKey;
  initial?: any | null;
  onSubmit: (payload: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const schema = useMemo(() => schemaFor(entity), [entity]);

  const defaults = useMemo(() => {
    const common = { isActive: initial?.isActive ?? true };
    // if (entity === "hero")
    //   return {
    //     ...common,
    //     title: initial?.title ?? "",
    //     subtitle: initial?.subtitle ?? "",
    //     images: initial?.images ?? [],
    //   };
    // if (entity === "stats")
    //   return {
    //     ...common,
    //     title: initial?.title ?? "",
    //     value: initial?.value ?? 0,
    //     trend: initial?.trend ?? 0,
    //   };
    if (entity === "products")
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
        warranty_months: initial?.warranty_months ?? 0,
        is_active: initial?.is_active ?? 1,
      };
    return {
      ...common,
      key: initial?.key ?? "",
      title: initial?.title ?? "",
      description: initial?.description ?? "",
    };
  }, [entity, initial]);

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  // const [uploads, setUploads] = useState<FileValue[]>(
  //   (entity === "hero" ? (initial?.images ?? []) : []).map(
  //     (dataUrl: string, i: number) => ({
  //       name: `image-${i + 1}.png`,
  //       size: 0,
  //       type: "image/png",
  //       dataUrl,
  //     }),
  //   ),
  // );

  async function submit(values: any) {
    const payload = { ...values };
    // if (entity === "hero") payload.images = uploads.map((u) => u.dataUrl);
    await onSubmit(payload);
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
      {/* {entity === "hero" ? (
        <>
          <Input
            label={t("form.title")}
            error={form.formState.errors.title?.message as any}
            {...form.register("title")}
          />
          <Input
            label={t("form.subtitle")}
            error={form.formState.errors.subtitle?.message as any}
            {...form.register("subtitle")}
          />
          <Input
            type="date"
            label={t("form.manufactoring")}
            error={form.formState.errors.manufactoring?.message as any}
            {...form.register("manufactoring")}
          />
          <Input
            type="date"
            label={t("form.expired")}
            error={form.formState.errors.expired?.message as any}
            {...form.register("expired")}
          />
        </>
      ) : null}

      {entity === "stats" ? (
        <>
          <Input
            label={t("form.title")}
            error={form.formState.errors.title?.message as any}
            {...form.register("title")}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Value"
              type="number"
              error={form.formState.errors.value?.message as any}
              {...form.register("value")}
            />
            <Input
              label="Trend %"
              type="number"
              error={form.formState.errors.trend?.message as any}
              {...form.register("trend")}
            />
          </div>
        </>
      ) : null}

      {entity === "testimonials" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label={t("form.name")}
              error={form.formState.errors.name?.message as any}
              {...form.register("name")}
            />
            <Input
              label={t("form.role")}
              error={form.formState.errors.role?.message as any}
              {...form.register("role")}
            />
          </div>
          <Input
            label={t("form.rating")}
            type="number"
            min={1}
            max={5}
            error={form.formState.errors.rating?.message as any}
            {...form.register("rating")}
          />
          <Textarea
            label={t("form.comment")}
            error={form.formState.errors.comment?.message as any}
            {...form.register("comment")}
          />
        </>
      ) : null}

      {entity === "social" ? (
        <>
          <Input
            label={t("settings.platform")}
            error={form.formState.errors.platform?.message as any}
            {...form.register("platform")}
          />
          <Input
            label={t("settings.url")}
            error={form.formState.errors.url?.message as any}
            {...form.register("url")}
          />
        </>
      ) : null}

      {entity === "seo" ? (
        <>
          <Input
            label={t("settings.key")}
            error={form.formState.errors.key?.message as any}
            {...form.register("key")}
          />
          <Input
            label={t("settings.title")}
            error={form.formState.errors.title?.message as any}
            {...form.register("title")}
          />
          <Textarea
            label={t("settings.description")}
            error={form.formState.errors.description?.message as any}
            {...form.register("description")}
          />
        </>
      ) : null} */}
      {entity === "products" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Name AR"
              error={(form.formState.errors.name as any)?.ar?.message as any}
              {...form.register("name.ar")}
            />

            <Input
              label="Name EN"
              error={(form.formState.errors.name as any)?.en?.message as any}
              {...form.register("name.en")}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Textarea
              label="Description AR"
              error={
                (form.formState.errors.description as any)?.ar?.message as any
              }
              {...form.register("description.ar")}
            />

            <Textarea
              label="Description EN"
              error={
                (form.formState.errors.description as any)?.en?.message as any
              }
              {...form.register("description.en")}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="SKU"
              error={form.formState.errors.sku?.message as any}
              {...form.register("sku")}
            />

            <Input
              label="Prefix"
              error={form.formState.errors.prefix?.message as any}
              {...form.register("prefix")}
            />
          </div>

          <Input
            label="Category"
            error={form.formState.errors.category?.message as any}
            {...form.register("category")}
          />

          <Input
            type="number"
            label="Warranty Months"
            error={form.formState.errors.warranty_months?.message as any}
            {...form.register("warranty_months")}
          />

          <div className="flex items-center gap-3">
            <Toggle
              checked={form.watch("is_active") === 1}
              onChange={(next) => form.setValue("is_active", next ? 1 : 0)}
              label="Active"
            />
          </div>
        </>
      ) : null}
      <div className="flex flex-wrap justify-end gap-2 mt-6">
        <Button type="submit" variant="primary" loading={loading}>
          {t("app.save")}
        </Button>
        <Button type="button" onClick={onCancel}>
          {t("app.cancel")}
        </Button>
      </div>
    </form>
  );
}
