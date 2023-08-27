"use client";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folder, LucidePlus } from "lucide-react";
import { FC } from "react";
import NewButtonItem from "./NewButtonItem";
import useNewFolder from "../../hooks/useNewFolder";

interface NewButtonProps {
  folderId: number | "base";
}

const NewButton: FC<NewButtonProps> = ({ folderId }) => {
  const {
    form,
    onSubmit,
    isLoading,
    dialogOpen,
    error,
    setDialogOpen,
    closeDialog,
  } = useNewFolder(folderId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonWithIcon Icon={LucidePlus}>New</ButtonWithIcon>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <NewButtonItem
          form={form}
          formName="label"
          menuItemLabel="Folder"
          MenuItemIcon={Folder}
          dialogTitle="Create a Folder"
          dialogDescription="Add a label and create a new folder"
          onSubmit={(data) => onSubmit(data, closeDialog)}
          isLoading={isLoading}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          error={error}
        />
        {/* <NewButtonItem /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewButton;
