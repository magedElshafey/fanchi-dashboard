import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthCard from "../../components/auth/AuthCard";
import AuthFooter from "../../components/auth/AuthFooter";
import AuthHeader from "../../components/auth/AuthHeader";

import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const roleOptions = [
  {
    value: "",
    label: "Select role",
  },
  {
    value: "super_admin",
    label: "Super Admin",
  },
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "customer_service",
    label: "Customer Service",
  },
  {
    value: "editor",
    label: "Editor",
  },
];

export default function Register() {
  const { t } = useTranslation();

  return (
    <AuthCard>
      <AuthHeader
        title="auth.register.title"
        subtitle="auth.register.subtitle"
      />

      <form className="space-y-5">
        {/* Full Name */}
        <Input type="text" label={t("auth.fullName")} placeholder="John Doe" />

        {/* Email */}
        <Input
          type="email"
          label={t("auth.email")}
          placeholder="example@example.com"
        />

        {/* Role */}
        <Select label={t("auth.role")} defaultValue="" options={roleOptions} />

        {/* Password */}
        <Input
          type="password"
          label={t("auth.password")}
          placeholder="••••••••"
        />

        {/* Confirm Password */}
        <Input
          type="password"
          label={t("auth.confirmPassword")}
          placeholder="••••••••"
        />

        {/* Submit */}
        <button className="w-full btn btn-primary h-11">
          {t("auth.createAccount")}
        </button>

        {/* Terms */}
        <p className="text-center text-xs leading-6 text-[var(--muted)]">
          {t("auth.register.agreement")}{" "}
          <Link
            to="/terms"
            className="font-medium text-[var(--primary2)] hover:opacity-80"
          >
            {t("auth.terms")}
          </Link>{" "}
          &{" "}
          <Link
            to="/privacy"
            className="font-medium text-[var(--primary2)] hover:opacity-80"
          >
            {t("auth.privacy")}
          </Link>
        </p>
      </form>

      <AuthFooter
        text="auth.register.footer.text"
        action="auth.register.footer.action"
        to="/login"
      />
    </AuthCard>
  );
}
