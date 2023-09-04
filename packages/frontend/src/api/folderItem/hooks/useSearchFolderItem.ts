import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { getFolderItemsSearch } from "../folderItem.api";
import { useToast } from "@/components/ui/use-toast";
import { FolderItemsSearch } from "@probnote/backend/src/components/folderItem/types.folderItem";
import ResponseError from "utils/ResponseError";

export default function useSearchFolderItem(query: string) {
  const searchFolderItemsQueryKey = queryKeys.searchFolderItems(query);
  const { getToken } = useAuth();
  const { toast } = useToast();
  return useQuery<FolderItemsSearch, ResponseError>({
    queryKey: searchFolderItemsQueryKey,
    queryFn: () => getFolderItemsSearch(query, getToken),
    onError: (err) => {
      toast({
        title: "An error occured tying to search folder items",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
