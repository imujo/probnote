"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { File, Folder, MoreVertical } from "lucide-react";
import DeleteFolderItemDropdownItem from "./DeleteFolderItemDropdownItem";
import RenameFolderItemDropdownItem from "./RenameFolderItemDropdownItem";
import PinFolderDropdownItem from "./PinFolderDropdownItem";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderItem } from "utils/types.global";

const columns: ColumnDef<FolderItemsGet["data"][0]>[] = [
  {
    accessorKey: "label",
    header: "Label",
    size: 10000,
    cell: ({ row }) => {
      const label = row.original.label;
      const isFolder = row.original.Folder;

      return (
        <div className="flex items-center gap-2 text-zinc-900">
          {isFolder ? (
            <Folder className="h-4 w-4" />
          ) : (
            <File className="h-4 w-4" />
          )}
          <span>{label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    size: 1500,
    cell: ({ row }) => {
      const value = row.original.updatedAt;
      const date = new Date(value);
      return (
        <span className=" font-light text-zinc-500">
          {moment(date).fromNow()}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 1500,
    cell: ({ row }) => {
      const value = row.original.createdAt;
      const date = new Date(value);
      return (
        <span className=" font-light text-zinc-500">
          {moment(date).fromNow()}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    size: 100,
    cell: ({ row }) => {
      const original = row.original;
      const { label, id: folderItemId, Folder, Note } = original;

      const [dropdownOpen, setDropdownOpen] = useState(false);

      let folderItemType: keyof typeof FolderItem;

      if (Folder) {
        folderItemType = "FOLDER";
      } else if (Note && Note.ExerciseNote) {
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
            {row.original.Folder ? (
              <PinFolderDropdownItem
                folderId={row.original.Folder.id}
                pinned={row.original.Folder.pinned}
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
    },
  },
];

export default columns;