"use client";

import React, { FC } from "react";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import usePinFolder from "api/folder/hooks/usePinFolder";
import { Pin, PinOff } from "lucide-react";
import { FolderId } from "../../../../../../utils/types.global";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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

  const { mutate: pinFolder } = usePinFolder(
    folderId as number, // cannot be base
    currentFolderId as FolderId, // cannot be undefined
  );

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation();
        pinFolder({
          pinStatus: !pinned,
          label,
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
