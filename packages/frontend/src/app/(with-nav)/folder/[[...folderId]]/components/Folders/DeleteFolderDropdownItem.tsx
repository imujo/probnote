"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { FolderId } from "../../../../../../utils/types.global";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { ButtonLoading } from "@/components/ButtonLoading";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import ErrorPill from "@/components/ErrorPill";
import useDeleteFolderItem from "api/folderItem/hooks/useDeleteFolderItem";

interface DeleteFolderDropdownItemProps {
  folderId: FolderId;
}

const DeleteFolderDropdownItem: FC<DeleteFolderDropdownItemProps> = ({
  folderId,
}) => {
  const currentFolderId = useFolderIdFromParams();

  if (!currentFolderId) {
    // TODO navigate to 404
    return;
  }

  const [open, setOpen] = useState(false);
  if (folderId === "base") throw new Error("Cannote delete base folder");

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const {
    mutate: deleteFolder,
    isLoading,
    error,
  } = useDeleteFolderItem(folderId, currentFolderId, closeDialog);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>Delete Folder</DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this folder
        </DialogDescription>
        <DialogFooter className="items-center">
          {!!error && <ErrorPill>{error.message}</ErrorPill>}

          <DialogClose asChild>
            <Button variant={"secondary"} disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={() => deleteFolder()} variant="destructive">
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFolderDropdownItem;
