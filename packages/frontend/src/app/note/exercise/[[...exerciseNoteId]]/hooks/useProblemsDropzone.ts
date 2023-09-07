import { useToast } from "@/components/ui/use-toast";
import { useMemo } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { FileData } from "utils/upload";

type UseProblemsDropzoneProps = {
  onDrop: DropzoneOptions["onDrop"];
  disabled: boolean | undefined;
  fileData: FileData[];
};

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export default function useProblemsDropzone({
  onDrop,
  disabled,
  fileData,
}: UseProblemsDropzoneProps) {
  const { toast } = useToast();

  const dropzone = useDropzone({
    onDrop,
    disabled,
    accept: {
      "image/png": [".png", ".jpg"],
      "image/jpeg": [".jpeg", ".png"],
    },
    maxFiles: 30,
    minSize: 0,
    maxSize: MAX_FILE_SIZE,
    validator: (file) => {
      if (fileData.map(({ file }) => file.name).includes(file.name)) {
        toast({
          title: "Could not add file",
          description: `File with name ${file.name} is already added`,
          variant: "destructive",
        });

        return {
          code: "duplicate",
          message: `The file you provided is already added`,
        };
      }
      return null;
    },
  });

  const error = useMemo(
    () => dropzone.fileRejections[0]?.errors[0].message,
    [dropzone.fileRejections],
  );

  return { ...dropzone, error, disabled };
}
