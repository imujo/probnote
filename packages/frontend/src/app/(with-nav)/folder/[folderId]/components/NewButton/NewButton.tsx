"use client";

import React, { FC } from "react";
import { LucidePlus } from "lucide-react";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderId } from "../../../../../../utils/types.global";
import NewFolderButton from "./NewFolderButton";
import NewExerciseNoteButton from "./NewExerciseNoteButton";
import NewRegularNoteButton from "./NewRegularNoteButton";

interface NewButtonProps {
  folderId: FolderId;
}

const NewButton: FC<NewButtonProps> = ({ folderId }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonWithIcon Icon={LucidePlus}>New</ButtonWithIcon>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <NewFolderButton />
        <NewExerciseNoteButton />
        <NewRegularNoteButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewButton;
