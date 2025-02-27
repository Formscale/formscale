"use client";

import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { Dropdown, DropdownSelect } from "./dropdown";

interface FilterProps<T> {
  table: Table<T>;
  items: FilterGroup[];
  column?: string;
  select?: boolean;
  children?: React.ReactNode;
  globalSearch?: boolean;
}

interface FilterItem {
  title: string;
  value: string | boolean | undefined;
}

export interface FilterGroup {
  itemColumn: string;
  items: FilterItem[];
}

export function Filter<T>({ table, items, column, select, children, globalSearch }: FilterProps<T>) {
  const [selectedTitles, setSelectedTitles] = useState<Record<string, string>>(
    Object.fromEntries(items.map((group) => [group.itemColumn, group.items[0].title]))
  );

  const hasSearch = globalSearch || column;

  const handleSearch = (value: string) => {
    if (globalSearch) {
      table.setGlobalFilter(value);
    } else if (column) {
      table.getColumn(column)?.setFilterValue(value);
    }
  };

  const handleFilterSelect = (columnName: string, value: string | boolean | undefined, itemTitle: string) => {
    setSelectedTitles((prev) => ({ ...prev, [columnName]: itemTitle }));

    switch (columnName) {
      case "updatedAt":
        const now = new Date();
        let filterDate: Date | undefined;

        switch (value) {
          case "last_24_hours":
            filterDate = new Date(now.setHours(now.getHours() - 24));
            break;
          case "last_7_days":
            filterDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case "last_30_days":
            filterDate = new Date(now.setDate(now.getDate() - 30));
            break;
          default:
            filterDate = undefined;
        }

        table.getColumn(columnName)?.setFilterValue(filterDate);
        break;
      default:
        table.getColumn(columnName)?.setFilterValue(value);
        break;
    }
  };

  return (
    <div className={`flex w-full gap-2 items-center ${hasSearch ? "justify-between" : "justify-end"}`}>
      {hasSearch && (
        <Input
          placeholder={globalSearch ? "Search all..." : "Search..."}
          value={
            globalSearch
              ? ((table.getState().globalFilter as string) ?? "")
              : ((table.getColumn(column!)?.getFilterValue() as string) ?? "")
          }
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-background"
          // className={`w-full max-w-sm ${children || select ? "md:min-w-[400px]" : "w-auto"}`}
        />
      )}
      <div className="flex gap-2 w-full">
        {items.map((group) => (
          <Dropdown
            key={group.itemColumn}
            title={selectedTitles[group.itemColumn] ?? group.items[0].title}
            items={group.items.map((item) => ({
              title: item.title,
              onClick: () => handleFilterSelect(group.itemColumn, item.value, item.title),
            }))}
          />
        ))}
        {select && <DropdownSelect table={table} />}
        {children}
      </div>
    </div>
  );
}
