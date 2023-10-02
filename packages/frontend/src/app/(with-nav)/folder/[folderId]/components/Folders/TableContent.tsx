"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef, Table, flexRender } from "@tanstack/react-table";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { TableCell, TableRow, TableRowCenter } from "@/components/ui/table";
import ResponseError from "utils/ResponseError";
import routesConfig from "@/config/routes.config";

interface TableContentProps<TData> {
  error: ResponseError | null;
  isLoading: boolean;
  table: Table<TData>;
  columns: ColumnDef<TData, any>[];
}

function TableContent<TData>({
  isLoading,
  error,
  table,
  columns,
}: TableContentProps<TData>) {
  const router = useRouter();

  if (isLoading) {
    return (
      <TableRowCenter colLength={columns.length}>Loading...</TableRowCenter>
    );
  } else if (error)
    return (
      <TableRowCenter colLength={columns.length}>
        {error.message}
      </TableRowCenter>
    );
  else if (table.getRowModel().rows?.length) {
    return table.getRowModel().rows.map((row) => (
      <TableRow
        onClick={() => {
          const original = row.original as FolderItemsGet["data"][0];

          if (original.Folder) {
            router.push(routesConfig.folder(original.Folder.id));
          } else if (original.Note && original.Note.ExerciseNote) {
            router.push(routesConfig.problem(original.Note.ExerciseNote.id));
          } else {
            alert("Folder item isnt a folder or an exercise note");
          }
        }}
        className="cursor-pointer"
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            style={{
              width:
                cell.column.getSize() === Number.MAX_SAFE_INTEGER
                  ? "auto"
                  : cell.column.getSize(),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  } else {
    return (
      <TableRowCenter colLength={columns.length}>No results.</TableRowCenter>
    );
  }
}

export default TableContent;
