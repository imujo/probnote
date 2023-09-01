import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import queryKeys from "utils/queryKeys";
import { FolderId } from "../../../../../../types.global";
import {
  FolderGetChildren,
  FolderGetPinned,
  FolderPut,
} from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { putFolder } from "apiFunctions/folders.api";
import { useToast } from "@/components/ui/use-toast";

const validaiton = z.object({
  newLabel: z.string().min(4).max(30),
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
  const getPinnedFoldersQueryKey = queryKeys.getPinnedFolders();
  const { toast } = useToast();

  const { mutate, error, isLoading } = useMutation<
    FolderPut,
    ErrorResponse,
    string,
    {
      previousFolders: FolderGetChildren | undefined;
      previousPinnedFolders: FolderGetPinned | undefined;
    }
  >({
    mutationFn: async (newLabel: string) =>
      putFolder(folderId, { label: newLabel, pinned: true }),
    onMutate: async (newLabel) => {
      const previousFolders = await optimisticallyUpdateFolders(
        queryClient,
        getFoldersKey,
        folderId,
        newLabel,
      );

      const previousPinnedFolders = await optimisticallyUpdatePinnedFolders(
        queryClient,
        getPinnedFoldersQueryKey,
        folderId,
        newLabel,
      );

      return { previousFolders, previousPinnedFolders };
    },
    onError: (err, _, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(getFoldersKey, context.previousFolders);
      }
      if (context?.previousPinnedFolders) {
        queryClient.setQueryData(
          getPinnedFoldersQueryKey,
          context.previousPinnedFolders,
        );
      }

      toast({
        title: "An error occured tying to rename folders",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFoldersKey);
      queryClient.invalidateQueries(getPinnedFoldersQueryKey);
      closeDialog();
      toast({
        title: "Successfully renamed folder",
        description: data.message,
      });
    },
  });

  return { mutate, error, isLoading, form, onSubmit };
}

const optimisticallyUpdateFolders = async (
  queryClient: QueryClient,
  getFoldersQueryKey: QueryKey,
  folderId: number,
  newLabel: string,
) => {
  await queryClient.cancelQueries({ queryKey: getFoldersQueryKey });

  const previousFolders =
    queryClient.getQueryData<FolderGetChildren>(getFoldersQueryKey);

  if (!previousFolders) return;

  const newChildFolders = previousFolders.data.ChildFolders.map((folder) => {
    if (folder.id !== folderId) return folder;

    return { ...folder, label: newLabel };
  });

  const newNotes = previousFolders.data.Note.map((note) => {
    if (note.id !== folderId) return note;
    return { ...note, label: newLabel };
  });

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
  newLabel: string,
) => {
  await queryClient.cancelQueries({ queryKey: getPinnedFoldersQueryKey });

  const previousPinnedFolders = queryClient.getQueryData<FolderGetPinned>(
    getPinnedFoldersQueryKey,
  );

  if (!previousPinnedFolders) return;

  const newPinnedFoldersData = previousPinnedFolders.data.map((folder) => {
    if (folder.id !== folderId) return folder;

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
};
