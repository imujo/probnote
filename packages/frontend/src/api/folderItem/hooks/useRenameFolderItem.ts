import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import queryKeys from "utils/queryKeys";
import { FolderGetPinned } from "@probnote/backend/src/components/folder/types.folder";
import { FolderId } from "utils/types.global";
import {
  FolderItemsGet,
  FolderItemPut,
} from "@probnote/backend/src/components/folderItem/types.folderItem";
import { putFolderItem } from "api/folderItem/folderItem.api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import ResponseError from "utils/ResponseError";

export default function useRenameFolderItem(
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
    FolderItemPut,
    ResponseError,
    string,
    {
      previousFolders: FolderItemsGet | undefined;
      previousPinnedFolders: FolderGetPinned | undefined;
    }
  >({
    mutationFn: async (newLabel: string) =>
      putFolderItem(folderItemId, { label: newLabel }, getToken),
    onMutate: async (newLabel) => {
      const previousFolders = await optimisticallyUpdateFolderItems(
        queryClient,
        getFolderItemsQueryKey,
        folderItemId,
        newLabel,
      );

      const previousPinnedFolders = await optimisticallyUpdatePinnedFolders(
        queryClient,
        getPinnedFoldersQueryKey,
        folderItemId,
        newLabel,
      );

      return { previousFolders, previousPinnedFolders };
    },
    onError: (err, _, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(
          getFolderItemsQueryKey,
          context.previousFolders,
        );
      }
      if (context?.previousPinnedFolders) {
        queryClient.setQueryData(
          getPinnedFoldersQueryKey,
          context.previousPinnedFolders,
        );
      }

      toast({
        title: "An error occured tying to rename folder item",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFolderItemsQueryKey);
      queryClient.invalidateQueries(getPinnedFoldersQueryKey);
      toast({
        title: "Successfully renamed folder item",
        description: data.message,
      });

      if (onSuccess) onSuccess();
    },
  });

  return mutation;
}

async function optimisticallyUpdateFolderItems(
  queryClient: QueryClient,
  getFoldersQueryKey: QueryKey,
  folderItemId: number,
  newLabel: string,
) {
  await queryClient.cancelQueries({ queryKey: getFoldersQueryKey });

  const previousFolderItems =
    queryClient.getQueryData<FolderItemsGet>(getFoldersQueryKey);

  if (!previousFolderItems) return;

  const newFolderItemsData = previousFolderItems.data.map((folderItem) => {
    if (folderItem.id !== folderItemId) return folderItem;

    return {
      ...folderItem,
      label: newLabel,
    };
  });

  queryClient.setQueryData<FolderItemsGet>(getFoldersQueryKey, {
    ...previousFolderItems,
    data: newFolderItemsData,
  });

  return previousFolderItems;
}

async function optimisticallyUpdatePinnedFolders(
  queryClient: QueryClient,
  getPinnedFoldersQueryKey: QueryKey,
  folderItemId: number,
  newLabel: string,
) {
  await queryClient.cancelQueries({ queryKey: getPinnedFoldersQueryKey });

  const previousPinnedFolders = queryClient.getQueryData<FolderGetPinned>(
    getPinnedFoldersQueryKey,
  );

  if (!previousPinnedFolders) return;

  const newPinnedFoldersData = previousPinnedFolders.data.map((folder) => {
    if (folder.folderItemId !== folderItemId) return folder;

    return {
      ...folder,
      label: newLabel,
    };
  });

  queryClient.setQueryData<FolderGetPinned>(getPinnedFoldersQueryKey, {
    ...previousPinnedFolders,
    data: newPinnedFoldersData,
  });

  return previousPinnedFolders;
}
