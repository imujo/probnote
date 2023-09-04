import React, { ReactNode } from "react";
import { FieldValues } from "react-hook-form";
import { DialogClose } from "@radix-ui/react-dialog";
import { LucideIcon } from "lucide-react";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ResponseError from "utils/ResponseError";

interface NewButtonItemProps<T extends FieldValues> {
  menuItemLabel: string;
  MenuItemIcon: LucideIcon;
  dialogTitle: string;
  dialogDescription: string;
  onSubmit: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  error: ResponseError | null;
  children: ReactNode;
}

function NewButtonItem<T extends FieldValues>({
  MenuItemIcon,
  menuItemLabel,
  dialogTitle,
  dialogDescription,
  open,
  onOpenChange,
  isLoading,
  error,
  children,
  onSubmit,
}: NewButtonItemProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <MenuItemIcon className="mr-2 h-4 w-4" />
          <span>{menuItemLabel}</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle} </DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="items-center">
          {error ? <ErrorPill>{error.message}</ErrorPill> : null}
          <DialogClose asChild>
            <Button disabled={isLoading} variant="secondary">
              Close
            </Button>
          </DialogClose>

          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={onSubmit}>Save</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewButtonItem;
