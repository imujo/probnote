import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useQuery } from "react-query";
import { FolderId } from "../../../../../../types.global";
import queryKeys from "utils/queryKeys";
import { useToast } from "@/components/ui/use-toast";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { getFolderItems } from "apiFunctions/folderItem.api";

export default function useFolders(folderId: FolderId) {
  const queryKey = queryKeys.getFolderItems(folderId);
  const { toast } = useToast();

  return useQuery<FolderItemsGet, ErrorResponse>({
    queryKey: queryKey,
    queryFn: () => getFolderItems(folderId),
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch folder items",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
