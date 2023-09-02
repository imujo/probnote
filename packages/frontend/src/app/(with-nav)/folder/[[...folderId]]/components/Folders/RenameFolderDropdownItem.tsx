"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pen } from "lucide-react";
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
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
import useRenameFolderItemDropdownItem from "../../hooks/useRenameFolderItemDropdownItem";

interface RenameFolderDropdownItemProps {
  folderItemId: FolderId;
  currentLabel?: string;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
}

const RenameFolderDropdownItem: FC<RenameFolderDropdownItemProps> = ({
  folderItemId,
  currentLabel,
  setDropdownOpen,
}) => {
  const currentFolderId = useFolderIdFromParams();

  if (!currentFolderId) {
    // TODO navigate to 404
    return;
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  if (folderItemId === "base") throw new Error("Cannot rename base folder");

  const onSuccess = useCallback(() => {
    setDialogOpen(false);
    setDropdownOpen(false);
  }, []);

  const { isLoading, error, form, onSubmit } = useRenameFolderItemDropdownItem(
    folderItemId,
    currentFolderId,
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
        <DialogHeader>Rename Folder</DialogHeader>
        <DialogDescription>Add a new label for your folder</DialogDescription>
        <Form {...form}>
          <form className="my-3" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name={"newLabel"}
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
                    This is the new name of your folder
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
            <Button disabled={isLoading} variant={"secondary"}>
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
