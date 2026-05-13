import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  subtitle?: string;
};

export default function AuthHeader({ title, subtitle }: Props) {
  const { t } = useTranslation();
  return (
    <div className="mb-8 space-y-2 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/15 ring-1 ring-[var(--border2)]">
        <div className="h-6 w-6 rounded-lg bg-[var(--primary)]" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight">{t(title)}</h1>

      {subtitle && <p className="text-sm text-[var(--muted)]">{t(subtitle)}</p>}
    </div>
  );
}
