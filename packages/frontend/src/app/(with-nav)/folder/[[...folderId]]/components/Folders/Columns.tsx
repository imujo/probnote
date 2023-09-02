"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { File, Folder, MoreVertical, Trash } from "lucide-react";

import DeleteFolderDropdownItem from "./DeleteFolderDropdownItem";
import RenameFolderDropdownItem from "./RenameFolderDropdownItem";
import moment from "moment";
import PinFolderDropdownItem from "./PinFolderDropdownItem";
import { FolderGetItems } from "@probnote/backend/src/components/folder/types.folder";

export const columns: ColumnDef<FolderGetItems["data"][0]>[] = [
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
      const label = row.original.label;
      const folderItemId = row.original.id;

      return (
        <DropdownMenu>
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
            <RenameFolderDropdownItem
              folderId={folderItemId}
              currentLabel={label}
            />
            <DeleteFolderDropdownItem folderId={folderItemId} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
