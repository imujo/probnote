import { deleteFolder } from "apiFunctions/folders.api";
import { useMutation, useQueryClient } from "react-query";
import {
  FolderDelete,
  FolderGetChildren,
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
  const getFoldersKey = queryKeys.getFolders(currentFolderId);
  const { toast } = useToast();

  const mutation = useMutation<
    FolderDelete,
    ErrorResponse,
    void,
    { previousFolders: FolderGetChildren | undefined }
  >({
    mutationKey: mutationKey,
    mutationFn: () => deleteFolder(folderId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: getFoldersKey });

      const previousFolders =
        queryClient.getQueryData<FolderGetChildren>(getFoldersKey);

      if (!previousFolders) return { previousFolders: undefined };

      const newChildFolders = previousFolders.data.ChildFolders.filter(
        (folder) => folder.id !== folderId,
      );

      const newNotes = previousFolders.data.Note.filter(
        (note) => note.id !== folderId,
      );

      queryClient.setQueryData<FolderGetChildren>(getFoldersKey, {
        ...previousFolders,
        data: { ChildFolders: newChildFolders, Note: newNotes },
      });
      return { previousFolders };
    },
    onError: (err, _, context) => {
      // TODO toast error
      if (context?.previousFolders) {
        queryClient.setQueryData(getFoldersKey, context.previousFolders);
      }

      toast({
        title: "An error occured tying to delete folders",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFoldersKey);
      closeDialog();
      toast({
        title: "Successfully deleted folder",
        description: data.message,
      });
    },
  });

  return { ...mutation, mutationKey };
}
