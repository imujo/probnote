import { FC, useMemo } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Check, Info, Loader2, X } from "lucide-react";
import { cn } from "utils/cn";
import { FileDataState } from "utils/upload";
import TooltipItem from "@/components/TooltipItem";

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
    <div
      className={cn(
        "flex h-16 items-center gap-2 border-b-[1px] border-zinc-200 py-2 pr-4",
        state === "ERROR" && "",
      )}
    >
      {imageComponent}
      <div className="flex h-full flex-1 flex-col justify-evenly ">
        <TooltipItem
          disabled={state !== "ERROR"}
          tooltipText="Could not upload this file. Please remove it or retry upload."
        >
          <div
            className={cn(
              "flex items-center gap-2 text-sm",
              state === "ERROR" ? " cursor-default text-red-500" : null,
            )}
          >
            <span>{fileName}</span>
            {state === "ERROR" && <Info className="h-[14px] w-[14px] " />}
          </div>
        </TooltipItem>

        <Progress
          value={progress || 0}
          className={cn("h-2", state !== "UPLOADING" && "opacity-0")}
        />
      </div>
      {/* {state === "ERROR" && (
        <span className="flex items-center  text-red-500">Error</span>
      )} */}
      {(state === "INITIAL" || state === "ERROR") && (
        <button
          onClick={() => removeFile(index)}
          className=" hover:bg-transparent [&_svg]:text-zinc-400 hover:[&_svg]:text-zinc-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {state === "POSTING_PROBLEMS" || state === "GET_UPLOAD_URLS" ? (
        <Loader2 className=" spin h-4 w-4 animate-spin" />
      ) : null}
      {state === "DONE" && <Check className=" h-4 w-4 text-green-700 " />}
    </div>
  );
};

export default FileComponent;
