import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import usePostProblems from "api/problem/hooks/usePostProblems";
import FileComponent from "./FileComponent";
import { cn } from "utils/cn";
import ButtonLoading from "@/components/ButtonLoading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddProblemsModalProps {
  // open: boolean;
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProblemsModal: FC<AddProblemsModalProps> = ({}) => {
  const {
    fileData,
    upload,
    removeFile,
    dropzone,
    uploadState,
    dropzoneDisabled,
    closeDisabled,
    uploadDisabled,
    modalOpen,
    setModalOpen,
  } = usePostProblems();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = dropzone;

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <ButtonWithIcon Icon={Plus}>Add Problems</ButtonWithIcon>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => {
          if (closeDisabled) return e.preventDefault();
          setModalOpen(false);
        }}
        onPointerDownOutside={(e) => {
          if (closeDisabled) return e.preventDefault();
          setModalOpen(false);
        }}
        onCloseButton={(e) => {
          if (closeDisabled) return e.preventDefault();
          setModalOpen(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Problems to Exercise Note</DialogTitle>
          <DialogDescription>Upload images to add problems</DialogDescription>
        </DialogHeader>
        {uploadState === "INITIAL" && (
          <div
            {...getRootProps()}
            className={cn(
              "flex h-40 cursor-pointer items-center justify-center rounded-xl border-[1px] border-dashed border-primary/50 p-4 text-zinc-500",
              dropzoneDisabled
                ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                : null,
            )}
          >
            <input disabled={isDragReject} {...getInputProps()} />
            {isDragAccept && <p>Drop Files</p>}
            {isDragReject && <p>Some files will be rejected</p>}
            {!isDragActive && fileData.length === 0 && (
              <p>Drop or click to select</p>
            )}
            {!isDragActive && fileData.length !== 0 && (
              <p>Drop or click to select more</p>
            )}
          </div>
        )}
        <ScrollArea className="mt-4 max-h-52">
          {fileData?.map(({ file, progress, state }, i) => {
            return (
              <FileComponent
                key={i + file.name}
                index={i}
                removeFile={removeFile}
                fileName={file.name}
                file={file}
                progress={progress}
                state={state}
              />
            );
          })}
        </ScrollArea>
        <DialogFooter className="items-center">
          <Button
            onClick={() => setModalOpen(false)}
            disabled={closeDisabled}
            variant="secondary"
          >
            Cancel
          </Button>

          {/* {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={onUploadFile}>Save</Button>
            )} */}
          {uploadState === "INITIAL" && (
            <Button disabled={uploadDisabled} onClick={upload}>
              Upload
            </Button>
          )}
          {uploadState === "ERROR" && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button onClick={upload}>Retry upload</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove files with errors or retry uploading them</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {uploadState === "LOADING" && (
            <ButtonLoading>Uploading</ButtonLoading>
          )}
          {uploadState === "DONE" && (
            <Button onClick={() => setModalOpen(false)}>Save</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProblemsModal;
