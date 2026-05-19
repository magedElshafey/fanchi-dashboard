import { Download } from "lucide-react";
import Button from "../ui/Button";
import { useExportExcel } from "../../features/common/useExportExcel";

type Props = {
  endpoint: string;
  fileName?: string;
  label?: string;
  className?: string;
};

export default function ExportExcelButton({
  endpoint,
  fileName,
  label = "Export Excel",
  className,
}: Props) {
  const exportMutation = useExportExcel();

  return (
    <Button
      type="button"
      variant="primary"
      className={className}
      loading={exportMutation.isPending}
      leftIcon={<Download className="w-4 h-4" />}
      aria-label={label}
      onClick={() =>
        exportMutation.mutate({
          endpoint,
          fileName,
        })
      }
    >
      {label}
    </Button>
  );
}
