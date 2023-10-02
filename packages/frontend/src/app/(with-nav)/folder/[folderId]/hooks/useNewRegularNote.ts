import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FolderId } from "utils/types.global";
import usePostExerciseNote from "api/exerciseNote/hooks/usePostExerciseNote";
import usePostRegularNote from "api/regularNote/hooks/usePostRegularNote";

const validaiton = z.object({
  label: z.string().min(4).max(30),
});

type Validation = z.infer<typeof validaiton>;

export default function useNewRegularNoteButton(parentFolderId: FolderId) {
  const form = useForm<Validation>({
    resolver: zodResolver(validaiton),
    defaultValues: {
      label: "",
    },
  });
  const [open, setOpen] = useState(false);

  const onSuccess = () => {
    setOpen(false);
  };

  const { mutate, error, isLoading } = usePostRegularNote(
    parentFolderId,
    onSuccess,
  );

  const onSubmit = form.handleSubmit((data) => {
    mutate(data.label);
  });

  return {
    form,
    mutate,
    error,
    isLoading,
    onSubmit,
    dialogOpen: open,
    setDialogOpen: setOpen,
  };
}
