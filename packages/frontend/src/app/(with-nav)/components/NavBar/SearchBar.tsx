"use client";

import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import useSearchBar from "../../hooks/useSearchBar";
import {
  CommandDialog,
  CommandEmptyManual,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import { Folder } from "lucide-react";
import routesConfig from "@/config/routes.config";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const { searchQuery, setSearchQuery, isLoading, data, isEmpty } =
    useSearchBar();

  return (
    <>
      <Input
        readOnly
        value={""}
        type="text"
        onClick={() => setCommandDialogOpen(true)}
        placeholder="Search folders and notes"
      />

      <CommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      >
        <CommandInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search folders and notes"
          isLoading={isLoading}
        />
        <CommandList>
          <CommandEmptyManual isEmpty={isEmpty}>No results</CommandEmptyManual>
          {data?.data.map((folderItem) => {
            let href = "/";
            if (folderItem.Folder) {
              href = routesConfig.folder(folderItem.Folder.id);
            } else if (folderItem.Note?.ExerciseNote)
              href = routesConfig.problem(folderItem.Note.ExerciseNote.id);

            return (
              <CommandItem key={"search-folderitem-" + folderItem.id}>
                <Link
                  onClick={() => {
                    setCommandDialogOpen(false);
                    setSearchQuery("");
                  }}
                  href={href}
                  className="flex w-full items-center gap-2 "
                >
                  <Folder className="h-3 w-3 text-zinc-700 " />
                  <span>{folderItem.label}</span>
                </Link>
              </CommandItem>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
