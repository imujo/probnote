import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import queryKeys from "utils/queryKeys";
import { FolderId } from "../../../../../../types.global";
import { FolderGetPinned } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  FolderItemsGet,
  FolderItemPut,
} from "@probnote/backend/src/components/folderItem/types.folderItem";
import { putFolderItem } from "apiFunctions/folderItem.api";

const validaiton = z.object({
  newLabel: z.string().min(4).max(30),
});

type Validation = z.infer<typeof validaiton>;

export default function useRenameFolderItem(
  folderItemId: number,
  parentFolderId: FolderId,
  closeDialog: () => void,
) {
  const form = useForm<Validation>({
    resolver: zodResolver(validaiton),
    defaultValues: {
      newLabel: "",
    },
  });

  const onSubmit = async (data: Validation) => {
    await mutate(data.newLabel);
  };

  const queryClient = useQueryClient();
  const getFolderItemsQueryKey = queryKeys.getFolderItems(parentFolderId);
  const getPinnedFoldersQueryKey = queryKeys.getPinnedFolders();
  const { toast } = useToast();

  const { mutate, error, isLoading } = useMutation<
    FolderItemPut,
    ErrorResponse,
    string,
    {
      previousFolders: FolderItemsGet | undefined;
      previousPinnedFolders: FolderGetPinned | undefined;
    }
  >({
    mutationFn: async (newLabel: string) =>
      putFolderItem(folderItemId, { label: newLabel }),
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
        title: "An error occured tying to rename folders",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFolderItemsQueryKey);
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

const optimisticallyUpdateFolderItems = async (
  queryClient: QueryClient,
  getFoldersQueryKey: QueryKey,
  folderItemId: number,
  newLabel: string,
) => {
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
};

const optimisticallyUpdatePinnedFolders = async (
  queryClient: QueryClient,
  getPinnedFoldersQueryKey: QueryKey,
  folderItemId: number,
  newLabel: string,
) => {
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
};
