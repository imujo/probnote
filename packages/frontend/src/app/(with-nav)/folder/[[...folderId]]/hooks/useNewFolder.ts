import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPost } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { postFolder } from "apiFunctions/folders.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import queryKeys from "utils/queryKeys";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { FolderId } from "../../../../../../types.global";

const validaiton = z.object({
  label: z.string().min(4).max(30),
});

type Validation = z.infer<typeof validaiton>;

export default function useNewFolder(parentFolderId: FolderId) {
  const router = useRouter();
  const form = useForm<Validation>({
    resolver: zodResolver(validaiton),
    defaultValues: {
      label: "",
    },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const getFolderItemsQueryKey = queryKeys.getFolderItems(parentFolderId);

  const { mutate, error, isLoading } = useMutation<
    FolderPost,
    ErrorResponse,
    string,
    {
      previousFolderItems: FolderItemsGet | undefined;
    }
  >({
    mutationFn: (label) =>
      postFolder(label, parentFolderId === "base" ? null : parentFolderId),
    onMutate: async (label) => {
      const previousFolderItems = await optimisticallyUpdateFolderItems(
        queryClient,
        getFolderItemsQueryKey,
        label,
      );
      return { previousFolderItems };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFolderItemsQueryKey);
      closeDialog();
      router.push(`/folder/${data.data.folderId}`);
      toast({
        title: "Successfully created folder",
        description: data.message,
      });
    },
    onError: (err, _, context) => {
      if (context?.previousFolderItems) {
        queryClient.setQueryData(
          getFolderItemsQueryKey,
          context.previousFolderItems,
        );
      }
      toast({
        title: "An error occured tying to create a folder",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: Validation) => {
    await mutate(data.label);
  };

  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return {
    form,
    mutate,
    error,
    isLoading,
    onSubmit,
    dialogOpen: open,
    closeDialog,
    setDialogOpen: setOpen,
  };
}

const optimisticallyUpdateFolderItems = async (
  queryClient: QueryClient,
  getFolderItemsQueryKey: QueryKey,
  newLabel: string,
) => {
  await queryClient.cancelQueries({ queryKey: getFolderItemsQueryKey });

  const previousFolderItems = queryClient.getQueryData<FolderItemsGet>(
    getFolderItemsQueryKey,
  );

  if (!previousFolderItems) return;

  const newFolderItemsData = [
    ...previousFolderItems.data,
    {
      label: newLabel,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
      id: -1,
      Folder: {
        id: -1,
        pinned: false,
      },
    },
  ];

  queryClient.setQueryData<FolderItemsGet>(getFolderItemsQueryKey, {
    ...previousFolderItems,
    data: newFolderItemsData,
  });

  return previousFolderItems;
};
