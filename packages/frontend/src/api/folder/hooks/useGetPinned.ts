import queryKeys from "utils/queryKeys";
import { getPinnedFolders } from "api/folder/folder.api";
import { useQuery } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { FolderGetPinned } from "@probnote/backend/src/components/folder/types.folder";
import { useAuth } from "@clerk/nextjs";
import ResponseError from "utils/ResponseError";

export default function useGetPinned() {
  const queryKey = queryKeys.getPinnedFolders();
  const { toast } = useToast();
  const { getToken } = useAuth();

  return useQuery<FolderGetPinned, ResponseError>({
    queryKey,
    queryFn: () => getPinnedFolders(getToken),
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch pinned folders",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
