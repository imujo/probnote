"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pen, Pin, PinOff, Trash } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { FolderId } from "../../../../../../../types.global";
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
import { useParams } from "next/navigation";
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
import usePinFolder from "@/app/(with-nav)/hooks/usePinFolder";

interface PinFolderDropdownItemProps {
  folderId: FolderId;
  pinned: boolean;
  label: string;
}

const PinFolderDropdownItem: FC<PinFolderDropdownItemProps> = ({
  folderId,
  pinned,
  label,
}) => {
  const currentFolderId = useFolderIdFromParams();
  if (folderId === "base") throw new Error("Cannot pin base folder");
  if (!currentFolderId) {
    // TODO 404
    return;
  }

  const { mutate: pinFolder } = usePinFolder(folderId, currentFolderId);
  console.log(label, pinned);

  return (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        pinFolder({
          pinStatus: !pinned,
          label: label,
        });
      }}
      className="cursor-pointer"
    >
      {!pinned ? (
        <>
          <Pin className="mr-2 h-4 w-4" />
          <span>Pin</span>
        </>
      ) : (
        <>
          <PinOff className="mr-2 h-4 w-4" />
          <span>Unpin</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default PinFolderDropdownItem;
