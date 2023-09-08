import { FC, useMemo } from "react";
import { DropzoneState } from "react-dropzone";
import { cn } from "utils/cn";

interface DropzoneProps extends DropzoneState {
  disabled?: boolean;
  error?: string;
  hasFiles: boolean;
}

const Dropzone: FC<DropzoneProps> = ({
  getRootProps,
  getInputProps,
  disabled,
  isDragAccept,
  isDragReject,
  isDragActive,
  error,
  hasFiles,
}) => {
  const dropzoneText = useMemo(() => {
    if (isDragAccept) return "Drop Files";
    else if (isDragReject) return "Some files will be rejected";
    else if (!isDragActive && !hasFiles) return "Drop or click to select";
    else if (!isDragActive && hasFiles) return "Drop or click to select more";
  }, [isDragAccept, isDragReject, isDragActive, hasFiles]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1px] border-dashed border-primary/50 p-4 text-zinc-500",
        disabled || isDragReject
          ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
          : null,
      )}
    >
      <input disabled={isDragReject} {...getInputProps()} />

      <p>{dropzoneText}</p>
      {!!error && <p className="text-center text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Dropzone;
