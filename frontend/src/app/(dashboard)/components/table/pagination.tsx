import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

interface PaginationProps<T> {
  table: Table<T>;
}

export default function Pagination<T>({ table }: PaginationProps<T>) {
  const canPreviousPage = (table: Table<T>) => table.getCanPreviousPage();
  const canNextPage = (table: Table<T>) => table.getCanNextPage();

  return (
    <div className="flex w-full justify-between items-start gap-4">
      {table.getPageCount() !== 0 && (
        <span className="text-xs text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length}
          {/* ({table.getState().pagination.pageIndex + 1} of {table.getPageCount()}) */}
        </span>
      )}
      <div className="flex items-center justify-end gap-2">
        {(canPreviousPage(table) || canNextPage(table)) && (
          <>
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!canPreviousPage(table)}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!canNextPage(table)}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
