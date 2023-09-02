import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import { FolderGetPinned } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import queryKeys from "utils/queryKeys";
import { useToast } from "@/components/ui/use-toast";
import { FolderId } from "../../../../../../types.global";
import {
  FolderItemDelete,
  FolderItemsGet,
} from "@probnote/backend/src/components/folderItem/types.folderItem";
import { deleteFolderItem } from "apiFunctions/folderItem.api";

export default function useDeleteFolderItem(
  folderItemId: number,
  parentFolderId: FolderId,
  closeDialog: () => void,
) {
  const queryClient = useQueryClient();
  const getFolderItemsQueryKey = queryKeys.getFolderItems(parentFolderId);
  const getPinnedFoldersQueryKey = queryKeys.getPinnedFolders();
  const { toast } = useToast();

  const mutation = useMutation<
    FolderItemDelete,
    ErrorResponse,
    void,
    {
      previousFolderItems: FolderItemsGet | undefined;
      previousPinnedFolders: FolderGetPinned | undefined;
    }
  >({
    mutationFn: () => deleteFolderItem(folderItemId),
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
      // TODO toast error
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
      closeDialog();
      toast({
        title: "Successfully deleted folder item",
        description: data.message,
      });
    },
  });

  return { ...mutation };
}

const optimisticallyUpdateFolderItems = async (
  queryClient: QueryClient,
  getFolderItemsQueryKey: QueryKey,
  folderItemId: number,
) => {
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
};

const optimisticallyUpdatePinnedFolders = async (
  queryClient: QueryClient,
  getPinnedFoldersQueryKey: QueryKey,
  folderItemId: number,
) => {
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
};
