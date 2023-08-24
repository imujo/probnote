import { FolderGetParents } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { getBreadcrumbs } from "apiFunctions/breadcrumbs.api";
import { useQuery } from "react-query";

export default function useBreadcrumbs(folderId: number) {
  return useQuery<FolderGetParents, ErrorResponse>({
    queryKey: ["breadcrumbs", folderId],
    queryFn: () => getBreadcrumbs(folderId),
    select: (data) => {
      const breadcrumbs = [...data.data];
      breadcrumbs.reverse();
      return { ...data, data: breadcrumbs };
    },
  });
}
