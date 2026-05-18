import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import Input from "../../components/ui/Input";
import { useTranslation } from "react-i18next";
import useLoginLogic from "../../features/auth/logic/useLoginLogic";
import Spinner from "../../components/ui/Spinner";
export default function Login() {
  const { t } = useTranslation();
  const { errors, register, onSubmit, handleSubmit, isPending } =
    useLoginLogic();
  return (
    <AuthCard>
      <AuthHeader title="auth.login.title" subtitle="auth.login.subtitle" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="example@example.com"
            label={t("auth.email")}
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        <div className="space-y-2">
          <Input
            placeholder="******"
            type="password"
            label={t("auth.password")}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full transition-opacity duration-150 cursor-pointer btn btn-primary h-11 disabled:bg-opacity-30"
        >
          {isPending ? <Spinner /> : t("auth.signIn")}
        </button>
      </form>
    </AuthCard>
  );
}
