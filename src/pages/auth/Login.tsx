import { Link } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard";
import AuthFooter from "../../components/auth/AuthFooter";
import AuthHeader from "../../components/auth/AuthHeader";
import Input from "../../components/ui/Input";
import { useTranslation } from "react-i18next";
export default function Login() {
  const { t } = useTranslation();
  return (
    <AuthCard>
      <AuthHeader title="auth.login.title" subtitle="auth.login.subtitle" />

      <form className="space-y-5">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="example@example.com"
            label={t("auth.email")}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-xs text-[var(--primary2)] hover:opacity-80"
            >
              {t("auth.forget")}
            </Link>
          </div>

          <Input type="password" label={t("auth.password")} />
        </div>

        <button className="w-full btn btn-primary h-11">
          {t("auth.signIn")}
        </button>
      </form>

      <AuthFooter
        text="auth.login.footer.text"
        action="auth.login.footer.action"
        to="/auth/register"
      />
    </AuthCard>
  );
}
