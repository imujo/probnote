"use client";
import { TableCell, TableRow, TableRowCenter } from "@/components/ui/table";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { ColumnDef, Table, flexRender } from "@tanstack/react-table";

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
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
