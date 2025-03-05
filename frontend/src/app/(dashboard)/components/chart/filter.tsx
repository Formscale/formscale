"use client";

import { Form } from "@formscale/types";
import { useState } from "react";
import { Dropdown } from "../table/dropdown";

export type Filters = {
  dateRange: string | undefined;
  formId: string | undefined;
  status: string | undefined;
};

interface FilterProps {
  forms: Form[];
  onFilterChangeAction: (filters: Filters) => void;
}

export function Filter({ forms, onFilterChangeAction }: FilterProps) {
  const [selectedTitles, setSelectedTitles] = useState({
    dateRange: "Last 30 days",
    formName: "All forms",
    status: "All statuses",
  });

  const filterGroups = [
    {
      itemColumn: "status",
      items: [
        { title: "All statuses", value: undefined },
        { title: "Completed", value: "completed" },
        { title: "Pending", value: "pending" },
        { title: "Blocked", value: "blocked" },
        { title: "Failed", value: "failed" },
      ],
    },
    {
      itemColumn: "dateRange",
      items: [
        { title: "Last 30 days", value: "last_30_days" },
        { title: "Last 7 days", value: "last_7_days" },
        { title: "Last 24 hours", value: "last_24_hours" },
      ],
    },
    {
      itemColumn: "formName",
      items: [
        { title: "All forms", value: undefined },
        ...forms.map((form) => ({
          title: form.name,
          value: form.id,
        })),
      ],
    },
  ];

  const [filters, setFilters] = useState<Filters>({
    dateRange: "last_30_days",
    formId: undefined,
    status: undefined,
  });

  const handleFilterSelect = (columnName: string, value: string | undefined, itemTitle: string) => {
    setSelectedTitles((prev) => ({ ...prev, [columnName]: itemTitle }));

    const newFilters = { ...filters };

    switch (columnName) {
      case "dateRange":
        newFilters.dateRange = value;
        break;
      case "formName":
        newFilters.formId = value;
        break;
      case "status":
        newFilters.status = value;
        break;
      default:
        break;
    }

    setFilters(newFilters);
    onFilterChangeAction(newFilters);
  };

  return (
    <div className="flex gap-2 items-center justify-end">
      <div className="flex gap-2 w-full">
        {filterGroups.map((group) => (
          <Dropdown
            key={group.itemColumn}
            title={selectedTitles[group.itemColumn as keyof typeof selectedTitles]}
            items={group.items.map((item) => ({
              title: item.title,
              onClick: () => handleFilterSelect(group.itemColumn, item.value, item.title),
            }))}
          />
        ))}
      </div>
    </div>
  );
}
