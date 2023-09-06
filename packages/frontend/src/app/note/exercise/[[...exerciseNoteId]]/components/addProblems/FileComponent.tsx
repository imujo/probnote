import { FC, useMemo } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import ButtonIcon from "@/components/ButtonIcon";
import { Check, Info, Loader2, X } from "lucide-react";
import { cn } from "utils/cn";
import { FileDataState } from "utils/upload";
import { Button } from "@/components/ui/button";

interface FileComponentProps {
  fileName: string;
  file: File;
  progress?: number;
  state: FileDataState;
  removeFile: (index: number) => void;
  index: number;
}

const FileComponent: FC<FileComponentProps> = ({
  fileName,
  file,
  progress,
  state,
  removeFile,
  index,
}) => {
  const imageComponent = useMemo(
    () => (
      <Image
        alt={`${fileName}_preview`}
        src={URL.createObjectURL(file)}
        width={50}
        height={50}
        className="h-12 w-12 object-cover"
      />
    ),
    [file, fileName],
  );

  return (
    <div className="flex gap-2 border-b-[1px] border-zinc-200 py-2 pr-4 ">
      {imageComponent}
      <div className="flex flex-1 flex-col justify-evenly">
        <span className="text-sm">{fileName}</span>
        <Progress
          value={progress || 0}
          className={cn("h-2", state !== "UPLOADING" && "opacity-0")}
        />
      </div>
      {state === "INITIAL" ||
        (state === "ERROR" && (
          <ButtonIcon
            Icon={X}
            onClick={() => removeFile(index)}
            variant="ghost"
            className=" hover:bg-transparent [&_svg]:text-zinc-400 hover:[&_svg]:text-zinc-600"
          />
        ))}
      {state === "POSTING_PROBLEMS" || state === "GET_UPLOAD_URLS" ? (
        <Loader2 className=" spin h-4 w-4 animate-spin" />
      ) : null}
      {state === "DONE" && <Check className=" h-4 w-4 text-green-700" />}
      {state === "ERROR" && (
        <div className="flex gap-1 text-red-500">
          <Info className="h-3 w-3" />
          <span>Error</span>
        </div>
      )}
    </div>
  );
};

export default FileComponent;
