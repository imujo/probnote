"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pin, PinOff } from "lucide-react";
import { FC } from "react";
import { FolderId } from "../../../../../../utils/types.global";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import usePinFolder from "api/folder/hooks/usePinFolder";

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

  return (
    <DropdownMenuItem
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
