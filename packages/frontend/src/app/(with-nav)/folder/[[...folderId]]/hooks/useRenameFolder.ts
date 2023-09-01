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
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

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
      if (context?.previousFolders) {
        queryClient.setQueryData(getFoldersKey, context.previousFolders);
      }

      toast({
        title: "An error occured tying to rename folders",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFoldersKey);
      closeDialog();
      toast({
        title: "Successfully renamed folder",
        description: data.message,
      });
    },
  });

  return { mutate, error, isLoading, form, onSubmit };
}
