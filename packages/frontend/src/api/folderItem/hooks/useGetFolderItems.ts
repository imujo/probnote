import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useQuery } from "react-query";
import { FolderId } from "../../../utils/types.global";
import queryKeys from "utils/queryKeys";
import { useToast } from "@/components/ui/use-toast";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { getFolderItems } from "api/folderItem/folderItem.api";

export default function useGetFolderItems(parentFolderId: FolderId) {
  const queryKey = queryKeys.getFolderItems(parentFolderId);
  const { toast } = useToast();

  return useQuery<FolderItemsGet, ErrorResponse>({
    queryKey: queryKey,
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
