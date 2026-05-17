import { useQuery } from "@tanstack/react-query";
import { Axios } from "../../lib/axios/Axios";

export const useEntityList = (
  entity: string,
  page: number,
  pageSize: number,
  q?: string,
) => {
  return useQuery({
    queryKey: [entity, page, pageSize, q],

    queryFn: async () => {
      const res = await Axios.get(`/${entity}`, {
        params: {
          page,
          per_page: pageSize,
          q,
        },
      });

      return {
        items: res.data.data,
        total: res.data.meta.total,
        page: res.data.meta.current_page,
        pageSize: res.data.meta.per_page,
      };
    },
  });
};
