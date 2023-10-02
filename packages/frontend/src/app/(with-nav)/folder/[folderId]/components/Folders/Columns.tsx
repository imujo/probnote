"use client";

import React, { ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Ban, File, Folder, LucideIcon, PenLine } from "lucide-react";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import FolderItemPopover from "./FolderItemPopover";

const columns: ColumnDef<FolderItemsGet["data"][0]>[] = [
  {
    accessorKey: "label",
    header: "Label",
    size: 10000,
    cell: ({ row }) => {
      const label = row.original.label;
      const isFolder = !!row.original.Folder;
      const isExerciseNote = !!row.original.Note?.ExerciseNote;
      const isRegularNote = !!row.original.Note?.RegularNote;

      let Icon: LucideIcon = Ban;

      if (isFolder) Icon = Folder;
      else if (isExerciseNote) Icon = File;
      else if (isRegularNote) Icon = PenLine;

      return (
        <div className="flex items-center gap-2 text-zinc-900">
          <Icon className="h-4 w-4" />
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
      return <FolderItemPopover data={row.original} />;
    },
  },
];

export default columns;
