import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import { deleteFolderItem } from "api/folderItem/folderItem.api";
import { FolderGetPinned } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import queryKeys from "utils/queryKeys";
import {
  FolderItemDelete,
  FolderItemsGet,
} from "@probnote/backend/src/components/folderItem/types.folderItem";
import { useToast } from "@/components/ui/use-toast";
import { FolderId } from "../../../utils/types.global";
import { useAuth } from "@clerk/nextjs";

export default function useDeleteFolderItem(
  folderItemId: number,
  parentFolderId: FolderId,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  const getFolderItemsQueryKey = queryKeys.getFolderItems(parentFolderId);
  const getPinnedFoldersQueryKey = queryKeys.getPinnedFolders();
  const { toast } = useToast();
  const { getToken } = useAuth();

  const mutation = useMutation<
    FolderItemDelete,
    ErrorResponse,
    void,
    {
      previousFolderItems: FolderItemsGet | undefined;
      previousPinnedFolders: FolderGetPinned | undefined;
    }
  >({
    mutationFn: () => deleteFolderItem(folderItemId, getToken),
    onMutate: async () => {
      const previousFolderItems = await optimisticallyUpdateFolderItems(
        queryClient,
        getFolderItemsQueryKey,
        folderItemId,
      );
      const previousPinnedFolders = await optimisticallyUpdatePinnedFolders(
        queryClient,
        getPinnedFoldersQueryKey,
        folderItemId,
      );
      return { previousFolderItems, previousPinnedFolders };
    },
    onError: (err, _, context) => {
      if (context?.previousFolderItems) {
        queryClient.setQueryData(
          getFolderItemsQueryKey,
          context.previousFolderItems,
        );
      }
      if (context?.previousPinnedFolders) {
        queryClient.setQueryData(
          getPinnedFoldersQueryKey,
          context.previousPinnedFolders,
        );
      }

      toast({
        title: "An error occured tying to delete folder item",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFolderItemsQueryKey);
      queryClient.invalidateQueries(getPinnedFoldersQueryKey);
      toast({
        title: "Successfully deleted folder item",
        description: data.message,
      });
      if (onSuccess) onSuccess();
    },
  });

  return { ...mutation };
}

async function optimisticallyUpdateFolderItems(
  queryClient: QueryClient,
  getFolderItemsQueryKey: QueryKey,
  folderItemId: number,
) {
  await queryClient.cancelQueries({ queryKey: getFolderItemsQueryKey });

  const previousFolderItems = queryClient.getQueryData<FolderItemsGet>(
    getFolderItemsQueryKey,
  );

  if (!previousFolderItems) return;

  const newFolderItemsData = previousFolderItems.data.filter(
    (folderItem) => folderItem.id !== folderItemId,
  );

  queryClient.setQueryData<FolderItemsGet>(getFolderItemsQueryKey, {
    ...previousFolderItems,
    data: newFolderItemsData,
  });

  return previousFolderItems;
}

async function optimisticallyUpdatePinnedFolders(
  queryClient: QueryClient,
  getPinnedFoldersQueryKey: QueryKey,
  folderItemId: number,
) {
  await queryClient.cancelQueries({ queryKey: getPinnedFoldersQueryKey });

  const previousPinnedFolders = queryClient.getQueryData<FolderGetPinned>(
    getPinnedFoldersQueryKey,
  );

  if (!previousPinnedFolders) return;

  const newPinnedFoldersData = previousPinnedFolders.data.filter(
    (folder) => folder.folderItemId !== folderItemId,
  );

  queryClient.setQueryData<FolderGetPinned>(getPinnedFoldersQueryKey, {
    ...previousPinnedFolders,
    data: newPinnedFoldersData,
  });

  return previousPinnedFolders;
}
