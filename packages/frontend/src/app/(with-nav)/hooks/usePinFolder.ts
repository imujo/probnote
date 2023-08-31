import {
  FolderGet,
  FolderGetChildren,
  FolderGetPinned,
  FolderPut,
} from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { putFolder } from "apiFunctions/folders.api";
import { useMutation, useQueryClient } from "react-query";
import queryKeys from "utils/queryKeys";
import { FolderId } from "../../../../types.global";

export type PinFolderProps = {
  pinStatus: boolean;
  label: string;
};

export default function usePinFolder(
  folderId: number,
  currentFolderId: FolderId,
) {
  const queryClient = useQueryClient();
  const getPinnedFoldersQueryKey = queryKeys.getPinnedFolders();
  const getFoldersQueryKey = queryKeys.getFolders(currentFolderId);

  return useMutation<
    FolderPut,
    ErrorResponse,
    PinFolderProps,
    {
      prevPinnedFolders: FolderGetPinned | undefined;
      prevFolders: FolderGetChildren | undefined;
    }
  >({
    mutationFn: ({ pinStatus, label }: PinFolderProps) =>
      putFolder(folderId, { pinned: pinStatus }),
    onMutate: (data) => {
      const { pinStatus, label } = data;
      queryClient.cancelQueries({ queryKey: getPinnedFoldersQueryKey });
      queryClient.cancelQueries({ queryKey: getFoldersQueryKey });

      const prevPinnedFolders = queryClient.getQueryData<FolderGetPinned>(
        getPinnedFoldersQueryKey,
      );
      const prevFolders =
        queryClient.getQueryData<FolderGetChildren>(getFoldersQueryKey);

      if (!prevPinnedFolders || !prevFolders) return;

      let newPinnedFolders: FolderGetPinned["data"];

      if (pinStatus === false) {
        newPinnedFolders = prevPinnedFolders.data.filter(
          (folder) => folder.id !== folderId,
        );
      } else {
        newPinnedFolders = [
          {
            id: folderId,
            label,
          },
          ...prevPinnedFolders.data,
        ];
      }

      const newChildFolders = prevFolders.data.ChildFolders.map((folder) => {
        if (folder.id !== folderId) return folder;
        return {
          ...folder,
          pinned: !folder.pinned,
        };
      });

      queryClient.setQueriesData<FolderGetPinned>(getPinnedFoldersQueryKey, {
        ...prevPinnedFolders,
        data: newPinnedFolders,
      });

      queryClient.setQueriesData<FolderGetChildren>(getFoldersQueryKey, {
        ...prevFolders,
        data: {
          ...prevFolders.data,
          ChildFolders: newChildFolders,
        },
      });

      return { prevPinnedFolders, prevFolders };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getPinnedFoldersQueryKey });
      queryClient.invalidateQueries({ queryKey: getFoldersQueryKey });
    },
    onError: (err, _, context) => {
      if (context?.prevPinnedFolders) {
        queryClient.setQueriesData<FolderGetPinned>(
          getPinnedFoldersQueryKey,
          context.prevPinnedFolders,
        );
      }

      if (context?.prevFolders) {
        queryClient.setQueriesData<FolderGetChildren>(
          getFoldersQueryKey,
          context.prevFolders,
        );
      }
    },
  });
}
