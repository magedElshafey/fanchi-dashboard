import React from "react";
import { useTranslation } from "react-i18next";
import { useKpiStats } from "../features/common/hooks";
import { CardSkeleton, Skeleton } from "../components/ui/Skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingU0p, Users, ShoppingCart, Percent } from "lucide-react";

function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 card">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold opacity-80">{title}</div>
        <div className="rounded-xl border border-[var(--border2)] p-2 bg-[rgba(255,255,255,.06)]">
          {icon}
        </div>
      </div>
      <div className="mt-3 text-2xl font-black tracking-tight">{value}</div>
      <div className="mt-2 h-px bg-[var(--border)]" />
      <div className="mt-2 text-xs opacity-70">Updated just now (mock)</div>
    </div>
  );
}

export default function DashboardHome() {
  const { t } = useTranslation();
  const q = useKpiStats();

  if (q.isLoading) {
    return (
      <div className="grid gap-3 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const s = q.data;

  if (!s) return null;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-4">
        <KpiCard
          title={t("home.revenue")}
          value={`$${s.revenue.toLocaleString()}`}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          title={t("home.users")}
          value={s.users.toLocaleString()}
          icon={<Users className="w-4 h-4" />}
        />
        <KpiCard
          title={t("home.orders")}
          value={s.orders.toLocaleString()}
          icon={<ShoppingCart className="w-4 h-4" />}
        />
        <KpiCard
          title={t("home.conversion")}
          value={`${s.conversion}%`}
          icon={<Percent className="w-4 h-4" />}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="p-4 card">
          <div className="mb-3 text-sm font-bold">{t("home.traffic")}</div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.trafficSeries}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 card">
          <div className="mb-3 text-sm font-bold">{t("home.activity")}</div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.activitySeries}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* <div className="p-4 card">
        <div className="mb-3 text-sm font-bold">{t("home.topPages")}</div>
        <div className="grid gap-2">
          {s.topPages.map((p: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3 bg-[rgba(255,255,255,.04)]"
            >
              <div className="font-semibold">{p.path}</div>
              <div className="text-sm opacity-80">
                {p.views.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
