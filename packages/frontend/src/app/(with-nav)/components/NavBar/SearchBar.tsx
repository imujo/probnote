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

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const { searchQuery, setSearchQuery, isLoading, data, isEmpty } =
    useSearchBar();

  return (
    <>
      <Input
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
            const href = folderItem.Folder
              ? `/folder/${folderItem.Folder.id}`
              : "note";

            return (
              <CommandItem>
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
