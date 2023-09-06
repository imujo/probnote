import ButtonLoading from "@/components/ButtonLoading";
import ErrorPill from "@/components/ErrorPill";
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
import useExerciseNoteId from "hooks/useExerciseNoteId";
import { Plus, X } from "lucide-react";
import { ChangeEvent, FC, useCallback, useMemo } from "react";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import { useDropzone } from "react-dropzone";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import ButtonIcon from "@/components/ButtonIcon";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "utils/cn";
import useAll from "api/problem/hooks/useAll";
import FileComponent from "./FileComponent";

interface AddProblemsButtonProps {}

const AddProblemsButton: FC<AddProblemsButtonProps> = ({}) => {
  const exerciseNoteId = useExerciseNoteId();
  const { fileData, onInputChange, upload, removeFile } = useAll();

  const { toast } = useToast();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop: onInputChange,
    accept: {
      "image/png": [".png", ".jpg"],
      "image/jpeg": [".jpeg", ".png"],
    },
    validator: (file) => {
      if (fileData?.map(({ file }) => file.name).includes(file.name)) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonWithIcon Icon={Plus}>Add Problems</ButtonWithIcon>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Problems to Exercise Note</DialogTitle>
          <DialogDescription>Upload images to add problems</DialogDescription>
        </DialogHeader>
        <div
          {...getRootProps()}
          className="flex h-40 items-center justify-center rounded-xl border-[1px] border-dashed border-primary/50 p-4 text-zinc-500"
        >
          <input
            disabled={isDragReject}
            className="bg-red-500"
            {...getInputProps()}
          />
          {isDragAccept && <p>Drop Files</p>}
          {isDragReject && <p>Some files will be rejected</p>}
          {!isDragActive && <p>Drop or click to select</p>}
        </div>
        <ScrollArea className="mt-4 h-52">
          {fileData?.map(({ file, progress, state }, i) => {
            return (
              <FileComponent
                key={i}
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
          {/* {error ? <ErrorPill>{error.message}</ErrorPill> : null} */}
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>

          {/* {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={onUploadFile}>Save</Button>
            )} */}
          <Button onClick={() => upload(fileData)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProblemsButton;
