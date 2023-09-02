import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPost } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { postFolder } from "api/folder/folder.api";
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
import queryKeys from "utils/queryKeys";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { useToast } from "@/components/ui/use-toast";
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
