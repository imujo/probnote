import { useToast } from "@/components/ui/use-toast";
import { FolderGetPinned } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { getPinnedFolders } from "api/folder/folder.api";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";

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
