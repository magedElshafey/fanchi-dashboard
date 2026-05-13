import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Home, Settings, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { useTranslation } from "react-i18next";

type Item = { to: string; labelKey: string; icon: React.ReactNode };

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [homeOpen, setHomeOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const homeItems: Item[] = useMemo(
    () => [
      { to: "/home/hero", labelKey: "nav.hero", icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" /> },
      { to: "/home/stats", labelKey: "nav.stats", icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" /> },
      { to: "/home/testimonials", labelKey: "nav.testimonials", icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" /> },
    ],
    []
  );

  const settingsItems: Item[] = useMemo(
    () => [
      { to: "/settings/site", labelKey: "nav.site", icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" /> },
      { to: "/settings/contact", labelKey: "nav.contact", icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" /> },
      { to: "/settings/social", labelKey: "nav.social", icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" /> },
      { to: "/settings/seo", labelKey: "nav.seo", icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" /> },
    ],
    []
  );

  function sectionActive(prefix: string) {
    return pathname.startsWith(prefix);
  }

  return (
    <aside className={cn("h-full p-3", collapsed ? "w-[84px]" : "w-[290px]")}>
      <div className="card p-3 h-full flex flex-col">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-10 w-10 rounded-2xl bg-[var(--primary)] grid place-items-center text-white font-black">D</div>
          {!collapsed ? (
            <div className="min-w-0">
              <div className="text-sm font-black tracking-wide">{t("app.title")}</div>
              <div className="text-xs opacity-70">Vite + TS + Tailwind</div>
            </div>
          ) : null}
        </div>

        <div className="divider my-3" />

        <nav className="space-y-2 flex-1 overflow-auto scrollbar pr-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                isActive ? "bg-[rgba(124,58,237,.18)] border border-[var(--border2)]" : "hover:bg-white/5"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            {!collapsed ? <span>{t("nav.dashboard")}</span> : null}
          </NavLink>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setHomeOpen((v) => !v)}
              className={cn(
                "w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                sectionActive("/home") ? "bg-[rgba(124,58,237,.12)]" : "hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-3">
                <Home className="h-4 w-4" />
                {!collapsed ? <span>{t("nav.home")}</span> : null}
              </span>
              {!collapsed ? <ChevronDown className={cn("h-4 w-4 transition", homeOpen ? "rotate-180" : "")} /> : null}
            </button>

            {homeOpen && !collapsed ? (
              <div className="ml-5 space-y-1">
                {homeItems.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                        isActive ? "bg-[rgba(255,255,255,.06)] border border-[var(--border)]" : "hover:bg-white/5"
                      )
                    }
                  >
                    {it.icon}
                    <span>{t(it.labelKey)}</span>
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              className={cn(
                "w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                sectionActive("/settings") ? "bg-[rgba(124,58,237,.12)]" : "hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                {!collapsed ? <span>{t("nav.settings")}</span> : null}
              </span>
              {!collapsed ? <ChevronDown className={cn("h-4 w-4 transition", settingsOpen ? "rotate-180" : "")} /> : null}
            </button>

            {settingsOpen && !collapsed ? (
              <div className="ml-5 space-y-1">
                {settingsItems.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                        isActive ? "bg-[rgba(255,255,255,.06)] border border-[var(--border)]" : "hover:bg-white/5"
                      )
                    }
                  >
                    {it.icon}
                    <span>{t(it.labelKey)}</span>
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="divider my-3" />
        <div className="px-2 text-xs opacity-70">
          {collapsed ? "v0.1" : "MVP starter • scalable sections • reusable UI"}
        </div>
      </div>
    </aside>
  );
}
