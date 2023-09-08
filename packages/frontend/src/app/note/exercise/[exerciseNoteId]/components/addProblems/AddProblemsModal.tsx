import React, { FC } from "react";
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
import FileComponent from "./FileComponent";
import Dropzone from "./Dropzone";
import AddProblemsModalFooterButtons from "./AddProblemsModalFooter";
import useAddProblems from "../../hooks/useAddProblems";

interface AddProblemsModalProps {
  triggerClassName?: string;
}

const AddProblemsModal: FC<AddProblemsModalProps> = ({ triggerClassName }) => {
  const {
    fileData,
    closeModalAndDelete,
    upload,
    removeFile,
    dropzone,
    uploadState,
    modalOpen,
    setModalOpen,
    closeModal,
  } = useAddProblems();

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <ButtonWithIcon className={triggerClassName} Icon={Plus}>
          Add
        </ButtonWithIcon>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={closeModalAndDelete}
        onPointerDownOutside={closeModalAndDelete}
        onCloseButton={closeModalAndDelete}
      >
        <DialogHeader>
          <DialogTitle>Add Problems to Exercise Note</DialogTitle>
          <DialogDescription>Upload images to add problems</DialogDescription>
        </DialogHeader>
        {!dropzone.disabled && (
          <Dropzone {...dropzone} hasFiles={fileData.length !== 0} />
        )}
        <ScrollArea className="mt-4 max-h-52">
          {fileData.map(({ file, progress, state }, i) => {
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
          <AddProblemsModalFooterButtons
            uploadState={uploadState}
            closeModal={closeModal}
            closeModalAndDelete={closeModalAndDelete}
            upload={upload}
            hasFiles={fileData.length !== 0}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProblemsModal;
