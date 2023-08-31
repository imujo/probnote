import { FolderGetParents } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { getBreadcrumbs } from "apiFunctions/breadcrumbs.api";
import { QueryKey, useQuery } from "react-query";
import { FolderId } from "../../../../../../types.global";

export default function useBreadcrumbs(folderId: FolderId) {
  return useQuery<FolderGetParents, ErrorResponse, FolderGetParents, QueryKey>({
    queryKey: ["breadcrumbs", folderId],
    queryFn: () => {
      if (folderId === "base") {
        return {
          message: "Base folder has no parent folders",
          data: {
            more: false,
            parentFolders: [],
          },
        };
      }
      return getBreadcrumbs(folderId);
    },
    select: (data) => {
      const breadcrumbs = [...data.data.parentFolders];
      breadcrumbs.reverse();
      return {
        message: data.message,
        data: {
          more: data.data.more,
          parentFolders: breadcrumbs,
        },
      };
    },
  });
}
