import queryKeys from "utils/queryKeys";
import { getPinnedFolders } from "api/folder/folder.api";
import { useQuery } from "react-query";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useToast } from "@/components/ui/use-toast";
import { FolderGetPinned } from "@probnote/backend/src/components/folder/types.folder";

export default function useGetPinned() {
  const queryKey = queryKeys.getPinnedFolders();
  const { toast } = useToast();
  return useQuery<FolderGetPinned, ErrorResponse>({
    queryKey,
    queryFn: getPinnedFolders,
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch pinned folders",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
