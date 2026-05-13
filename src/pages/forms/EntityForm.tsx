import React, { useMemo, useState } from "react";
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

type EntityKey = "hero" | "stats" | "testimonials" | "social" | "seo";

const base = z.object({
  isActive: z.boolean().default(true),
});

const heroSchema = base.extend({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  images: z.array(z.string()).default([]),
});

const statSchema = base.extend({
  title: z.string().min(2),
  value: z.coerce.number().min(0),
  trend: z.coerce.number().min(-100).max(100),
});

const testimonialSchema = base.extend({
  name: z.string().min(2),
  role: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5),
});

const socialSchema = base.extend({
  platform: z.string().min(2),
  url: z.string().url(),
});

const seoSchema = base.extend({
  key: z.string().min(2),
  title: z.string().min(2),
  description: z.string().optional(),
});

function schemaFor(entity: EntityKey) {
  if (entity === "hero") return heroSchema;
  if (entity === "stats") return statSchema;
  if (entity === "testimonials") return testimonialSchema;
  if (entity === "social") return socialSchema;
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
    if (entity === "hero")
      return {
        ...common,
        title: initial?.title ?? "",
        subtitle: initial?.subtitle ?? "",
        images: initial?.images ?? [],
      };
    if (entity === "stats")
      return {
        ...common,
        title: initial?.title ?? "",
        value: initial?.value ?? 0,
        trend: initial?.trend ?? 0,
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
      {/* <div className="flex items-center justify-between">
        <Toggle
          checked={!!v.isActive}
          onChange={(next) => form.setValue("isActive", next)}
          label={t("form.isActive")}
        />
      </div> */}

      {entity === "hero" ? (
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
      ) : null}

      <div className="flex flex-wrap gap-2">
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
