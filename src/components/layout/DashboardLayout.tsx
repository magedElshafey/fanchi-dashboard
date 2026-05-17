import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import { useTranslation } from "react-i18next";

function titleForPath(path: string, t: (k: string) => string) {
  if (path === "/") return t("nav.dashboard");
  if (path.startsWith("/generate-code")) return t("nav.hero");
  if (path.startsWith("/home/stats")) return t("nav.stats");
  if (path.startsWith("/home/testimonials")) return t("nav.testimonials");
  if (path.startsWith("/settings/site")) return t("nav.site");
  if (path.startsWith("/settings/contact")) return t("nav.contact");
  if (path.startsWith("/settings/social")) return t("nav.social");
  if (path.startsWith("/settings/seo")) return t("nav.seo");
  return t("app.title");
}

export default function DashboardLayout() {
  const location = useLocation();
  const { t } = useTranslation();

  const pageTitle = useMemo(
    () => titleForPath(location.pathname, t),
    [location.pathname, t],
  );

  return (
    <div>
      {/* <Sidebar collapsed={collapsed} /> */}
      <div>
        <Topbar />
        <main className="p-3">
          <div className="mb-3">
            <div className="text-xl font-black tracking-tight">{pageTitle}</div>
          </div>
          <Outlet />
          <div className="pb-10 mt-10 text-xs opacity-60">
            © {new Date().getFullYear()} Fanchi
          </div>
        </main>
      </div>
    </div>
  );
}
