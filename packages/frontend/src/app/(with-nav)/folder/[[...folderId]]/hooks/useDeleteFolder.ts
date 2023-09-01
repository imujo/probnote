import { deleteFolder } from "apiFunctions/folders.api";
import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import {
  FolderDelete,
  FolderGetChildren,
  FolderGetPinned,
} from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import queryKeys from "utils/queryKeys";
import { FolderId } from "../../../../../../types.global";
import { useToast } from "@/components/ui/use-toast";

export default function useDeleteFolder(
  folderId: number,
  currentFolderId: FolderId,
  closeDialog: () => void,
) {
  const queryClient = useQueryClient();
  const mutationKey = ["folder", "delete", folderId];
  const getFoldersQueryKey = queryKeys.getFolders(currentFolderId);
  const getPinnedFoldersQueryKey = queryKeys.getPinnedFolders();
  const { toast } = useToast();

  const mutation = useMutation<
    FolderDelete,
    ErrorResponse,
    void,
    {
      previousFolders: FolderGetChildren | undefined;
      previousPinnedFolders: FolderGetPinned | undefined;
    }
  >({
    mutationKey: mutationKey,
    mutationFn: () => deleteFolder(folderId),
    onMutate: async () => {
      const previousFolders = await optimisticallyUpdateFolders(
        queryClient,
        getFoldersQueryKey,
        folderId,
      );
      const previousPinnedFolders = await optimisticallyUpdatePinnedFolders(
        queryClient,
        getPinnedFoldersQueryKey,
        folderId,
      );
      return { previousFolders, previousPinnedFolders };
    },
    onError: (err, _, context) => {
      // TODO toast error
      if (context?.previousFolders) {
        queryClient.setQueryData(getFoldersQueryKey, context.previousFolders);
      }
      if (context?.previousPinnedFolders) {
        queryClient.setQueryData(
          getPinnedFoldersQueryKey,
          context.previousPinnedFolders,
        );
      }

      toast({
        title: "An error occured tying to delete folders",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFoldersQueryKey);
      queryClient.invalidateQueries(getPinnedFoldersQueryKey);
      closeDialog();
      toast({
        title: "Successfully deleted folder",
        description: data.message,
      });
    },
  });

  return { ...mutation, mutationKey };
}

const optimisticallyUpdateFolders = async (
  queryClient: QueryClient,
  getFoldersQueryKey: QueryKey,
  folderId: number,
) => {
  await queryClient.cancelQueries({ queryKey: getFoldersQueryKey });

  const previousFolders =
    queryClient.getQueryData<FolderGetChildren>(getFoldersQueryKey);

  if (!previousFolders) return;

  const newChildFolders = previousFolders.data.ChildFolders.filter(
    (folder) => folder.id !== folderId,
  );

  const newNotes = previousFolders.data.Note.filter(
    (note) => note.id !== folderId,
  );

  queryClient.setQueryData<FolderGetChildren>(getFoldersQueryKey, {
    ...previousFolders,
    data: { ChildFolders: newChildFolders, Note: newNotes },
  });

  return previousFolders;
};

const optimisticallyUpdatePinnedFolders = async (
  queryClient: QueryClient,
  getPinnedFoldersQueryKey: QueryKey,
  folderId: number,
) => {
  await queryClient.cancelQueries({ queryKey: getPinnedFoldersQueryKey });

  const previousPinnedFolders = queryClient.getQueryData<FolderGetPinned>(
    getPinnedFoldersQueryKey,
  );

  if (!previousPinnedFolders) return;

  const newPinnedFoldersData = previousPinnedFolders.data.filter(
    (folder) => folder.id !== folderId,
  );

  queryClient.setQueryData<FolderGetPinned>(getPinnedFoldersQueryKey, {
    ...previousPinnedFolders,
    data: newPinnedFoldersData,
  });

  return previousPinnedFolders;
};
