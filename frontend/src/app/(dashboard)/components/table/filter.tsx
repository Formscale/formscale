"use client";

import { useState } from "react";
import { Dropdown } from "./dropdown";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface FilterProps<T> {
  table: Table<T>;
  items: FilterGroup[];
  column?: string;
}

interface FilterItem {
  title: string;
  value: string | boolean | undefined;
}

export interface FilterGroup {
  itemColumn: string;
  items: FilterItem[];
}

export function Filter<T>({ table, items, column }: FilterProps<T>) {
  const [selectedTitles, setSelectedTitles] = useState<Record<string, string>>(
    Object.fromEntries(items.map((group) => [group.itemColumn, group.items[0].title]))
  );

  const handleSearch = (value: string) => {
    if (column) {
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
    <div className={`flex w-full gap-2 items-center ${column ? "justify-between" : "justify-end"}`}>
      {column && (
        <Input
          placeholder="Search..."
          value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-md"
        />
      )}
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
    </div>
  );
}
