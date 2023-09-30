import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { FC, useState } from "react";
import PinFolderDropdownItem from "./PinFolderDropdownItem";
import RenameFolderItemDropdownItem from "./RenameFolderItemDropdownItem";
import DeleteFolderItemDropdownItem from "./DeleteFolderItemDropdownItem";
import { FolderItem } from "utils/types.global";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";

interface FolderItemPopoverProps {
  data: FolderItemsGet["data"][0];
}

const FolderItemPopover: FC<FolderItemPopoverProps> = ({ data }) => {
  const { label, id: folderItemId, Folder: folder, Note: note } = data;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  let folderItemType: keyof typeof FolderItem;

  if (folder) {
    folderItemType = "FOLDER";
  } else if (note && note.ExerciseNote) {
    folderItemType = "EXERCISE_NOTE";
  } else {
    folderItemType = "REGULAR_NOTE";
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
        {folder ? (
          <PinFolderDropdownItem
            folderId={folder.id}
            pinned={folder.pinned}
            label={label}
          />
        ) : null}
        <RenameFolderItemDropdownItem
          folderItemId={folderItemId}
          currentLabel={label}
          setDropdownOpen={setDropdownOpen}
          folderItemType={folderItemType}
        />
        <DeleteFolderItemDropdownItem
          folderItemId={folderItemId}
          setDropdownOpen={setDropdownOpen}
          folderItemType={folderItemType}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FolderItemPopover;
