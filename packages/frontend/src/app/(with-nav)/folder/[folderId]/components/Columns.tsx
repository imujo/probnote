"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Folder, MoreVertical } from "lucide-react";

export type Folder = {
  id: number;
  label: string;
  lastUpdated: string;
  created: string;
};

export const columns: ColumnDef<Folder>[] = [
  {
    accessorKey: "label",
    header: "Label",
    size: 10000,
    cell: ({ row }) => {
      const label = row.original.label;

      return (
        <div className="flex items-center gap-2 text-zinc-900  ">
          <Folder className="h-4 w-4" />
          <span>{label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    size: 1300,
    cell: ({ row }) => {
      const value = row.original.lastUpdated;
      return <span className=" font-light text-zinc-500">{value}</span>;
    },
  },
  {
    accessorKey: "created",
    header: "Created",
    size: 1300,
    cell: ({ row }) => {
      const value = row.original.created;
      return <span className=" font-light text-zinc-500">{value}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    size: 100,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(row.original.id + "")
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
