import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderId } from "utils/types.global";
import useRenameFolderItem from "api/folderItem/hooks/useRenameFolderItem";

const validaiton = z.object({
  newLabel: z.string().min(4).max(30),
});

type Validation = z.infer<typeof validaiton>;

export default function useRenameFolderItemDropdownItem(
  folderItemId: number,
  parentFolderId: FolderId,
  onSuccess: () => void,
) {
  const form = useForm<Validation>({
    resolver: zodResolver(validaiton),
    defaultValues: {
      newLabel: "",
    },
  });

  const { mutate, isLoading, error } = useRenameFolderItem(
    folderItemId,
    parentFolderId,
    onSuccess,
  );

  const onSubmit = async (data: Validation) => {
    await mutate(data.newLabel);
  };

  return { mutate, isLoading, form, error, onSubmit };
}
