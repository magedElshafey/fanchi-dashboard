import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { useSettings, useUpdateSettings } from "../../features/common/hooks";
import type { ContactSettings } from "../../types/entities";
import { CardSkeleton } from "../../components/ui/Skeleton";

const schema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  mapIframe: z.string().optional(),
});

export default function ContactSettingsPage() {
  const { t } = useTranslation();
  const q = useSettings<ContactSettings>("contact");
  const m = useUpdateSettings<ContactSettings>("contact");

  const defaults = useMemo(() => ({
    phone: q.data?.phone ?? "",
    email: q.data?.email ?? "",
    address: q.data?.address ?? "",
    mapIframe: q.data?.mapIframe ?? "",
  }), [q.data]);

  const form = useForm<any>({
    resolver: zodResolver(schema),
    values: defaults,
  });

  if (q.isLoading) return <CardSkeleton lines={6} />;

  async function submit(values: any) {
    try {
      await m.mutateAsync(values);
      toast.success(t("app.save"));
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    }
  }

  return (
    <div className="card p-4 space-y-4">
      <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label={t("settings.phone")} {...form.register("phone")} />
          <Input label={t("settings.email")} {...form.register("email")} />
        </div>
        <Input label={t("settings.address")} {...form.register("address")} />
        <Textarea label={t("settings.mapIframe")} hint="Paste iframe snippet. Stored in local mock db." {...form.register("mapIframe")} />

        <div className="flex gap-2">
          <Button type="submit" variant="primary" loading={m.isPending}>
            {t("app.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
