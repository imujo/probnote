"use client";

import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { Pen } from "lucide-react";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import { DialogClose } from "@radix-ui/react-dialog";
import useRenameFolderItemDropdownItem from "../../hooks/useRenameFolderItemDropdownItem";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ErrorPill from "@/components/ErrorPill";

interface RenameFolderItemDropdownItemProps {
  folderItemId: FolderId;
  currentLabel?: string;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
  folderItemType: keyof typeof FolderItem;
}

const RenameFolderDropdownItem: FC<RenameFolderItemDropdownItemProps> = ({
  folderItemId,
  currentLabel,
  setDropdownOpen,
  folderItemType,
}) => {
  const currentFolderId = useFolderIdFromParams();

  const [dialogOpen, setDialogOpen] = useState(false);

  const onSuccess = useCallback(() => {
    setDialogOpen(false);
    setDropdownOpen(false);
  }, [setDialogOpen, setDropdownOpen]);

  const { isLoading, error, form, onSubmit } = useRenameFolderItemDropdownItem(
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
          className="cursor-pointer"
        >
          <Pen className="mr-2 h-4 w-4" />
          <span>Rename</span>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>Rename {FolderItem[folderItemType]}</DialogHeader>
        <DialogDescription>
          Add a new label for your {FolderItem[folderItemType].toLowerCase()}
        </DialogDescription>
        <Form {...form}>
          <form className="my-3" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name="newLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newLabel">Label</FormLabel>
                  <FormControl>
                    <Input
                      id="newLabel"
                      placeholder={currentLabel || "Calculus 101"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the new name of your{" "}
                    {FolderItem[folderItemType].toLowerCase()}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="items-center">
          {!!error && <ErrorPill>{error.message}</ErrorPill>}

          <DialogClose asChild>
            <Button disabled={isLoading} variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)}>Rename</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameFolderDropdownItem;
