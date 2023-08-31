import { useMutation, useQueryClient } from "react-query";
import queryKeys from "utils/queryKeys";
import { FolderId } from "../../../../../../types.global";
import {
  FolderGetChildren,
  FolderPut,
} from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { putFolder } from "apiFunctions/folders.api";

const validaiton = z.object({
  newLabel: z.string().min(4).max(40),
});

type Validation = z.infer<typeof validaiton>;

export default function useRenameFolder(
  folderId: number,
  currentFolderId: FolderId,
  closeDialog: () => void,
) {
  const form = useForm<Validation>({
    resolver: zodResolver(validaiton),
  });

  const onSubmit = async (data: Validation) => {
    await mutate(data.newLabel);
  };

  const queryClient = useQueryClient();

  const getFoldersKey = queryKeys.getFolders(currentFolderId);

  const { mutate, error, isLoading } = useMutation<
    FolderPut,
    ErrorResponse,
    string,
    { previousFolders: FolderGetChildren | undefined }
  >({
    mutationFn: async (newLabel: string) =>
      putFolder(folderId, { label: newLabel, pinned: true }),
    onMutate: async (newLabel) => {
      await queryClient.cancelQueries({ queryKey: getFoldersKey });

      const previousFolders =
        queryClient.getQueryData<FolderGetChildren>(getFoldersKey);

      if (!previousFolders) return { previousFolders: undefined };

      const newChildFolders = previousFolders.data.ChildFolders.map(
        (folder) => {
          if (folder.id !== folderId) return folder;

          return { ...folder, label: newLabel };
        },
      );

      const newNotes = previousFolders.data.Note.map((note) => {
        if (note.id !== folderId) return note;
        return { ...note, label: newLabel };
      });

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getFoldersKey);
      closeDialog();
    },
  });

  return { mutate, error, isLoading, form, onSubmit };
}
