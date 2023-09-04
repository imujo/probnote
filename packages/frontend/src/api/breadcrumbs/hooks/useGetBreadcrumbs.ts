import { FolderGetParents } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { getBreadcrumbs } from "api/breadcrumbs/breadcrumbs.api";
import { QueryKey, useQuery } from "react-query";
import { FolderId } from "../../../utils/types.global";
import { useToast } from "@/components/ui/use-toast";
import queryKeys from "utils/queryKeys";
import { useAuth } from "@clerk/nextjs";

export default function useGetBreadcrumbs(folderId: FolderId) {
  const { toast } = useToast();
  const getBreadcrumbsQueryKey = queryKeys.getBreadcrumbs(folderId);
  const { getToken } = useAuth();

  return useQuery<FolderGetParents, ErrorResponse, FolderGetParents, QueryKey>({
    queryKey: getBreadcrumbsQueryKey,
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
      return getBreadcrumbs(folderId, getToken);
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
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch breadcrumbs",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
