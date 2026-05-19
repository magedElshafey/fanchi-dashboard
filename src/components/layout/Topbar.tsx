import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages, Moon, Sun, Search } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { applyTheme, getTheme, toggleTheme } from "../../lib/theme";
import { applyDocumentDirection } from "../../i18n";
import { cn } from "../../lib/cn";
import { NavLink } from "react-router-dom";
type Item = { to: string; labelKey: string; icon: React.ReactNode };

export default function Topbar({
  onSearchChange,
  searchValue,
}: {
  onSearchChange?: (q: string) => void;
  searchValue?: string;
}) {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const lang = i18n.language;

  const themeIcon = useMemo(
    () =>
      theme === "light" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      ),
    [theme],
  );

  function switchLang(next: "en" | "ar") {
    localStorage.setItem("lang", next);
    i18n.changeLanguage(next);
    applyDocumentDirection(next);
  }
  const homeItems: Item[] = useMemo(
    () => [
      {
        to: "/products",
        labelKey: "nav.products",
        icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" />,
      },
      {
        to: "/code-batches",
        labelKey: "nav.batches",
        icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" />,
      },
      {
        to: "/generate-code",
        labelKey: "nav.hero",
        icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" />,
      },

      {
        to: "/verifications",
        labelKey: "nav.verifications",
        icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" />,
      },
      {
        to: "/countries",
        labelKey: "nav.countries",
        icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" />,
      },
      {
        to: "/cities",
        labelKey: "nav.cities",
        icon: <span className="h-2 w-2 rounded-full bg-[var(--primary2)]" />,
      },
    ],
    [],
  );
  return (
    <header className="sticky top-0 z-30 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 card">
        {onSearchChange ? (
          <div className={cn("min-w-[220px] sm:min-w-[320px]")}>
            <Input
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("app.search")}
              className="pl-10"
            />
            <Search className="w-4 h-4 ml-3 -mt-8 opacity-70" />
          </div>
        ) : null}
        <ul className="flex flex-wrap items-center gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-[rgba(124,58,237,.18)] border border-[var(--border2)]"
                  : "hover:bg-white/5",
              )
            }
          >
            <span>{t("nav.dashboard")}</span>
          </NavLink>
          {homeItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                  isActive
                    ? "bg-[rgba(255,255,255,.06)] border border-[var(--border)]"
                    : "hover:bg-white/5",
                )
              }
            >
              {it.icon}
              <span>{t(it.labelKey)}</span>
            </NavLink>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => {
              const next = toggleTheme();
              setTheme(next);
            }}
            leftIcon={themeIcon}
          >
            <span className="hidden sm:inline">
              {theme === "light" ? "Light" : "Dark"}
            </span>
          </Button>

          <Button
            type="button"
            onClick={() => switchLang(lang === "ar" ? "en" : "ar")}
            leftIcon={<Languages className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">
              {lang === "ar" ? "AR" : "EN"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
