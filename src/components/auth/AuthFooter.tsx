import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
type Props = {
  text: string;
  action: string;
  to: string;
};

export default function AuthFooter({ text, action, to }: Props) {
  const { t } = useTranslation();
  return (
    <div className="mt-6 text-center text-sm text-[var(--muted)]">
      {t(text)}{" "}
      <Link
        to={to}
        className="font-semibold text-[var(--primary2)] hover:opacity-80"
      >
        {t(action)}
      </Link>
    </div>
  );
}
