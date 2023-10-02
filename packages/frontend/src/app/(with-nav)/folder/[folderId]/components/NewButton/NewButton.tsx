"use client";

import React, { FC } from "react";
import { LucidePlus } from "lucide-react";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewFolderButton from "./NewFolderButton";
import NewExerciseNoteButton from "./NewExerciseNoteButton";
import NewRegularNoteButton from "./NewRegularNoteButton";

const NewButton: FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonWithIcon Icon={LucidePlus}>New</ButtonWithIcon>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px]" align="end">
        <NewFolderButton />
        <NewExerciseNoteButton />
        <NewRegularNoteButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewButton;
