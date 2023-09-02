import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FolderId } from "utils/types.global";
import usePostFolder from "api/folder/hooks/usePostFolder";

const validaiton = z.object({
  label: z.string().min(4).max(30),
});

type Validation = z.infer<typeof validaiton>;

export default function usePostFolderButton(parentFolderId: FolderId) {
  const form = useForm<Validation>({
    resolver: zodResolver(validaiton),
    defaultValues: {
      label: "",
    },
  });
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  const { mutate, error, isLoading } = usePostFolder(
    parentFolderId,
    closeDialog,
  );

  const onSubmit = (data: Validation) => {
    mutate(data.label);
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
