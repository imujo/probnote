import ButtonLoading from "@/components/ButtonLoading";
import TooltipItem from "@/components/TooltipItem";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { FC } from "react";
import { UploadState } from "utils/upload";

interface AddProblemsModalFooterButtonsProps {
  uploadState: UploadState;
  closeModal: () => void;
  closeModalAndDelete: () => void;
  upload: () => void;
  hasFiles: boolean;
}

const PrimaryButton = ({
  uploadState,
  upload,
  hasFiles,
}: AddProblemsModalFooterButtonsProps) => {
  switch (uploadState) {
    case "INITIAL":
      return (
        <Button disabled={!hasFiles} onClick={upload}>
          Upload
        </Button>
      );
    case "LOADING":
      return <ButtonLoading>Uploading</ButtonLoading>;
    case "ERROR":
      return (
        <TooltipItem tooltipText="Remove files with errors or retry uploading them">
          <Button onClick={upload}>Retry upload</Button>
        </TooltipItem>
      );
    case "DONE":
      return (
        <DialogClose asChild>
          <Button>Save</Button>
        </DialogClose>
      );
  }
};

const SecondaryButton = ({
  uploadState,
  closeModalAndDelete,
}: AddProblemsModalFooterButtonsProps) => {
  const disabled = uploadState === "LOADING";

  if (uploadState === "INITIAL" || uploadState === "LOADING") {
    return (
      <Button
        onClick={closeModalAndDelete}
        disabled={disabled}
        variant="secondary"
      >
        Cancel
      </Button>
    );
  } else if (uploadState === "DONE" || uploadState === "ERROR") {
    return (
      <TooltipItem tooltipText="Delete uploaded files and cancel problem creation">
        <Button onClick={closeModalAndDelete} variant="secondary">
          Cancel and Delete
        </Button>
      </TooltipItem>
    );
  }
};

const AddProblemsModalFooterButtons: FC<AddProblemsModalFooterButtonsProps> = (
  props,
) => {
  return (
    <>
      <SecondaryButton {...props} />
      <PrimaryButton {...props} />
    </>
  );
};

export default AddProblemsModalFooterButtons;
