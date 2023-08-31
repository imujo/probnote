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
import { FolderChild } from "./Folders.types";
import DeleteFolderDropdownItem from "./DeleteFolderDropdownItem";
import RenameFolderDropdownItem from "./RenameFolderDropdownItem";
import moment from "moment";
import PinFolderDropdownItem from "./PinFolderDropdownItem";

export const columns: ColumnDef<FolderChild>[] = [
  {
    accessorKey: "label",
    header: "Label",
    size: 10000,
    cell: ({ row }) => {
      const label = row.original.label;
      const type = row.original.type;

      return (
        <div className="flex items-center gap-2 text-zinc-900">
          {type === "folder" ? (
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
      const { id, label, type } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
            {type === "folder" ? (
              <PinFolderDropdownItem
                folderId={id}
                pinned={row.original.pinned}
                label={label}
              />
            ) : null}
            <RenameFolderDropdownItem folderId={id} currentLabel={label} />
            <DeleteFolderDropdownItem folderId={id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
