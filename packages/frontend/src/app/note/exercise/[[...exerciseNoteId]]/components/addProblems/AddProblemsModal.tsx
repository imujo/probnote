import React, { FC, useState } from "react";
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
import { DialogClose } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import usePostProblems from "api/problem/hooks/usePostProblems";
import FileComponent from "./FileComponent";
import { cn } from "utils/cn";

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
  } = usePostProblems();

  const [open, setOpen] = useState(false);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = dropzone;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonWithIcon Icon={Plus}>Add Problems</ButtonWithIcon>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => {
          if (closeDisabled) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (closeDisabled) e.preventDefault();
        }}
        closeButtonDisabled={closeDisabled}
      >
        <DialogHeader>
          <DialogTitle>Add Problems to Exercise Note</DialogTitle>
          <DialogDescription>Upload images to add problems</DialogDescription>
        </DialogHeader>
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
          {!isDragActive && <p>Drop or click to select</p>}
        </div>
        <ScrollArea className="mt-4 h-52">
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
          <DialogClose asChild disabled={closeDisabled}>
            <Button variant="secondary">Close</Button>
          </DialogClose>

          {/* {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={onUploadFile}>Save</Button>
            )} */}
          <Button onClick={upload} disabled={uploadDisabled}>
            {uploadState !== "ERROR" ? "Upload" : null}
            {uploadState === "ERROR" ? "Retry upload" : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProblemsModal;
