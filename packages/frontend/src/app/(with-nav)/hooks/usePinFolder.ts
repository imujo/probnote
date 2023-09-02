import {
  FolderGetPinned,
  FolderPut,
} from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { putFolder } from "apiFunctions/folders.api";
import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import queryKeys from "utils/queryKeys";
import { FolderId } from "../../../../types.global";
import { useToast } from "@/components/ui/use-toast";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";

export type PinFolderProps = {
  pinStatus: boolean;
  label: string;
};

export default function usePinFolder(
  folderId: number,
  parentFolderId: FolderId,
) {
  const queryClient = useQueryClient();
  const getPinnedFoldersQueryKey = queryKeys.getPinnedFolders();
  const getFolderItemsQueryKey = queryKeys.getFolderItems(parentFolderId);
  const { toast } = useToast();

  return useMutation<
    FolderPut,
    ErrorResponse,
    PinFolderProps,
    {
      prevPinnedFolders: FolderGetPinned | undefined;
      prevFolderItems: FolderItemsGet | undefined;
    }
  >({
    mutationFn: ({ pinStatus, label }: PinFolderProps) =>
      putFolder(folderId, { pinned: pinStatus }),
    onMutate: async (data) => {
      const prevPinnedFolders = await optimisticallyUpdatePinnedFolders(
        queryClient,
        getPinnedFoldersQueryKey,
        folderId,
        data,
      );

      const prevFolderItems = await optimisticallyUpdateFolderItems(
        queryClient,
        getFolderItemsQueryKey,
        folderId,
      );

      return { prevPinnedFolders, prevFolderItems };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getPinnedFoldersQueryKey });
      queryClient.invalidateQueries({ queryKey: getFolderItemsQueryKey });
    },
    onError: (err, _, context) => {
      if (context?.prevPinnedFolders) {
        queryClient.setQueriesData<FolderGetPinned>(
          getPinnedFoldersQueryKey,
          context.prevPinnedFolders,
        );
      }

      if (context?.prevFolderItems) {
        queryClient.setQueriesData<FolderItemsGet>(
          getFolderItemsQueryKey,
          context.prevFolderItems,
        );
      }

      toast({
        title: "An error occured tying to pin/unpin folder",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Successfully pinned/unpinned folder",
        description: data.message,
      });
    },
  });
}

const optimisticallyUpdatePinnedFolders = (
  queryClient: QueryClient,
  getPinnedFoldersQueryKey: QueryKey,
  folderId: number,
  data: PinFolderProps,
) => {
  const { pinStatus, label } = data;
  queryClient.cancelQueries({ queryKey: getPinnedFoldersQueryKey });

  const prevPinnedFolders = queryClient.getQueryData<FolderGetPinned>(
    getPinnedFoldersQueryKey,
  );

  if (!prevPinnedFolders) return;

  let newPinnedFoldersData: FolderGetPinned["data"];

  if (pinStatus === false) {
    newPinnedFoldersData = prevPinnedFolders.data.filter(
      (folder) => folder.folderId !== folderId,
    );
  } else {
    newPinnedFoldersData = [
      {
        folderItemId: -1,
        folderId: folderId,
        label,
      },
      ...prevPinnedFolders.data,
    ];
  }

  queryClient.setQueriesData<FolderGetPinned>(getPinnedFoldersQueryKey, {
    ...prevPinnedFolders,
    data: newPinnedFoldersData,
  });

  return prevPinnedFolders;
};

const optimisticallyUpdateFolderItems = (
  queryClient: QueryClient,
  getFolderItemsQueryKey: QueryKey,
  folderId: number,
) => {
  queryClient.cancelQueries({ queryKey: getFolderItemsQueryKey });

  const prevFolderItems = queryClient.getQueryData<FolderItemsGet>(
    getFolderItemsQueryKey,
  );

  if (!prevFolderItems) return;

  const newFolderItemsData = prevFolderItems.data.map((folderItem) => {
    if (folderItem.Folder === null || folderItem.Folder.id !== folderId)
      return folderItem;
    return {
      ...folderItem,
      pinned: !folderItem.Folder.pinned,
    };
  });

  queryClient.setQueriesData<FolderItemsGet>(getFolderItemsQueryKey, {
    ...prevFolderItems,
    data: newFolderItemsData,
  });

  return prevFolderItems;
};
