import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPost } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { postFolder } from "apiFunctions/folders.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { FolderId } from "../../../../../../types.global";
import { useToast } from "@/components/ui/use-toast";

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

  const { mutate, error, isLoading } = useMutation<
    FolderPost,
    ErrorResponse,
    string
  >({
    mutationKey: ["post", "folder"],
    mutationFn: (label) =>
      postFolder(label, folderId === "base" ? null : folderId),
    onSuccess: (data) => {
      closeDialog();
      router.push(`/folder/${data.data.id}`);
      toast({
        title: "Successfully created folder",
        description: data.message,
      });
    },
    onError: (err) => {
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
