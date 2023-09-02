import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { getFolderItems } from "api/folderItem/folderItem.api";
import { useToast } from "@/components/ui/use-toast";
import { FolderId } from "../../../utils/types.global";

export default function useGetFolderItems(parentFolderId: FolderId) {
  const getFolderItemsQueryKey = queryKeys.getFolderItems(parentFolderId);
  const { toast } = useToast();

  return useQuery<FolderItemsGet, ErrorResponse>({
    queryKey: getFolderItemsQueryKey,
    queryFn: () => getFolderItems(parentFolderId),
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch folder items",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
