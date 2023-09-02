"use client";
import { TableCell, TableRow, TableRowCenter } from "@/components/ui/table";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { ColumnDef, Table, flexRender } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

interface TableContentProps<TData> {
  error: ErrorResponse | null;
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
        onClick={(e) => {
          const original = row.original as FolderItemsGet["data"][0];

          if (original.Folder) {
            router.push(`/folder/${original.Folder.id}`);
          } else {
            console.log("Folder items is not a folder");
          }
        }}
        className="cursor-pointer"
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
      >
        {row.getVisibleCells().map((cell, i) => (
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
