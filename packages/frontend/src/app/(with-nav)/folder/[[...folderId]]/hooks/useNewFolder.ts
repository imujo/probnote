import { zodResolver } from "@hookform/resolvers/zod";
import {
  FolderGetChildren,
  FolderPost,
} from "@probnote/backend/src/components/folder/types.folder";
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
import { FolderId } from "../../../../../../types.global";
import { useToast } from "@/components/ui/use-toast";
import queryKeys from "utils/queryKeys";

const validaiton = z.object({
  label: z.string().min(4).max(30),
});

type Validation = z.infer<typeof validaiton>;

export default function useNewFolder(folderId: FolderId) {
  const router = useRouter();
  const form = useForm<Validation>({
    resolver: zodResolver(validaiton),
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const getFoldersQueryKey = queryKeys.getFolders(folderId);

  const { mutate, error, isLoading } = useMutation<
    FolderPost,
    ErrorResponse,
    string,
    {
      previousFolders: FolderGetChildren | undefined;
    }
  >({
    mutationKey: ["post", "folder"],
    mutationFn: (label) =>
      postFolder(label, folderId === "base" ? null : folderId),
    onMutate: async (label) => {
      const previousFolders = await optimisticallyUpdateFolders(
        queryClient,
        getFoldersQueryKey,
        label,
      );
      return { previousFolders };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(getFoldersQueryKey);
      closeDialog();
      router.push(`/folder/${data.data.id}`);
      toast({
        title: "Successfully created folder",
        description: data.message,
      });
    },
    onError: (err, _, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(getFoldersQueryKey, context.previousFolders);
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

const optimisticallyUpdateFolders = async (
  queryClient: QueryClient,
  getFoldersQueryKey: QueryKey,
  newLabel: string,
) => {
  await queryClient.cancelQueries({ queryKey: getFoldersQueryKey });

  const previousFolders =
    queryClient.getQueryData<FolderGetChildren>(getFoldersQueryKey);

  if (!previousFolders) return;

  const newChildFolders = [
    ...previousFolders.data.ChildFolders,
    {
      label: newLabel,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
      id: -1,
    },
  ];

  queryClient.setQueryData<FolderGetChildren>(getFoldersQueryKey, {
    ...previousFolders,
    data: {
      ChildFolders: newChildFolders,
      Note: [...previousFolders.data.Note],
    },
  });

  return previousFolders;
};
