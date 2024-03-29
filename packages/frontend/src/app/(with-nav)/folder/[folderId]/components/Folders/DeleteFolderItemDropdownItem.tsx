"use client";

import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import useFolderId from "hooks/useFolderId";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash } from "lucide-react";
import useDeleteFolderItem from "api/folderItem/hooks/useDeleteFolderItem";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FolderId, FolderItem } from "../../../../../../utils/types.global";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ButtonLoading from "@/components/ButtonLoading";
import ErrorPill from "@/components/ErrorPill";

interface DeleteFolderItemDropdownItemProps {
  folderItemId: FolderId;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
  folderItemType: keyof typeof FolderItem;
}

const DeleteFolderItemDropdownItem: FC<DeleteFolderItemDropdownItemProps> = ({
  folderItemId,
  setDropdownOpen,
  folderItemType,
}) => {
  const currentFolderId = useFolderId();

  const [dialogOpen, setDialogOpen] = useState(false);

  const onSuccess = useCallback(() => {
    setDialogOpen(false);
    setDropdownOpen(false);
  }, [setDialogOpen, setDropdownOpen]);

  const {
    mutate: deleteFolder,
    isLoading,
    error,
  } = useDeleteFolderItem(
    folderItemId as number, // cannot be base
    currentFolderId as FolderId, // cannot be undefined
    onSuccess,
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setDialogOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>Delete {FolderItem[folderItemType]}</DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this{" "}
          {FolderItem[folderItemType].toLowerCase()}
        </DialogDescription>
        <DialogFooter className="items-center">
          {!!error && <ErrorPill>{error.message}</ErrorPill>}

          <DialogClose asChild>
            <Button variant="secondary" disabled={isLoading}>
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

export default DeleteFolderItemDropdownItem;
