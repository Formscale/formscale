"use client";

import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@formscale/ui/components";

import { DashCardHeader } from "../card";
import { Filter, FilterGroup } from "./filter";
import Pagination from "./pagination";
interface FilterProps {
  items: FilterGroup[];
  column?: string;
}

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterProps: FilterProps;
  onClickAction?: (row: TData) => void;
  WrapperComponent?: React.ComponentType<{ trigger: React.ReactNode; rowData: TData }>;
}

function Wrapper<TData extends { id: string }, TValue>({
  children,
  WrapperComponent,
  rowData,
}: {
  children: React.ReactNode;
  WrapperComponent?: React.ComponentType<{ trigger: React.ReactNode; rowData: TData }>;
  rowData: TData;
}) {
  if (WrapperComponent) {
    return <WrapperComponent trigger={children} rowData={rowData} />;
  }

  return <>{children}</>;
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  onClickAction = () => {},
  filterProps,
  WrapperComponent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "updatedAt",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <Filter {...filterProps} table={table} />
      <div className="rounded-lg overflow-hidden border w-full">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs text-muted-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Wrapper key={row.id} WrapperComponent={WrapperComponent} rowData={row.original}>
                  <TableRow
                    // key={row.id}
                    className="bg-background"
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onClickAction(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="text-xs cursor-pointer" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                </Wrapper>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-36 text-center">
                  <DashCardHeader title="No results found." description="Try changing your filters." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </>
  );
}
