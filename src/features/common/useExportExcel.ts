import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Axios } from "../../lib/axios/Axios";
import { apiUrl } from "../../services/api-routes/apiRoutes";

type ExportResponse = {
  status: boolean;
  message: string;
  data: {
    link: string;
  };
};

type ExportParams = {
  endpoint: string;
  fileName?: string;
};

export function useExportExcel() {
  return useMutation({
    mutationFn: async ({ endpoint, fileName }: ExportParams): Promise<void> => {
      const response = await Axios.get<ExportResponse>(`${apiUrl}${endpoint}`);

      const downloadUrl = response.data?.data?.link;

      if (!downloadUrl) {
        throw new Error("Download link not found");
      }

      // download file
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName || "export.xlsx");
      link.setAttribute("target", "_blank");

      document.body.appendChild(link);
      link.click();
      link.remove();
    },

    onSuccess: () => {
      toast.success("Excel exported successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to export excel",
      );
    },
  });
}
