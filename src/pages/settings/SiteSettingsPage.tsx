import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FileUploader, { FileValue } from "../../components/ui/FileUploader";
import { useSettings, useUpdateSettings } from "../../features/common/hooks";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { SiteSettings } from "../../types/entities";

const schema = z.object({
  slogan: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
});

export default function SiteSettingsPage() {
  const { t } = useTranslation();
  const q = useSettings<SiteSettings>("site");
  const m = useUpdateSettings<SiteSettings>("site");

  const [logo, setLogo] = useState([]);
  const [fav, setFav] = useState([]);

  const defaults = useMemo(
    () => ({
      slogan: q.data?.slogan ?? "",
      logo: q.data?.logo ?? "",
      favicon: q.data?.favicon ?? "",
    }),
    [q.data],
  );

  const form = useForm<any>({
    resolver: zodResolver(schema),
    values: defaults, // react-hook-form v7.43+ supports values for controlled reset
  });

  if (q.isLoading) return <CardSkeleton lines={5} />;

  async function submit(values: any) {
    const payload: SiteSettings = {
      slogan: values.slogan,
      logo: logo[0]?.dataUrl ?? values.logo,
      favicon: fav[0]?.dataUrl ?? values.favicon,
    };
    try {
      await m.mutateAsync(payload);
      toast.success(t("app.save"));
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    }
  }

  return (
    <div className="card p-4 space-y-4">
      <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
        <Input label={t("settings.slogan")} {...form.register("slogan")} />

        <FileUploader
          label={t("settings.logo")}
          value={logo}
          onChange={setLogo}
          multiple={false}
          hint="Upload logo (single). Preview + replace."
        />

        <FileUploader
          label={t("settings.favicon")}
          value={fav}
          onChange={setFav}
          multiple={false}
          hint="Upload favicon (single)."
        />

        <div className="flex gap-2">
          <Button type="submit" variant="primary" loading={m.isPending}>
            {t("app.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
