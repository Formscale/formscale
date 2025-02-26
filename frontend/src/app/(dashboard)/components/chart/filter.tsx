"use client";

import { Form } from "@formhook/types";
import { useState } from "react";
import { Dropdown } from "../table/dropdown";

interface FilterProps {
  forms: Form[];
}

export function Filter({ forms }: FilterProps) {
  const [selectedTitles, setSelectedTitles] = useState({
    dateRange: "All time",
    formName: "All forms",
    status: "All statuses",
  });

  const [selectedDateRange, setSelectedDateRange] = useState<string>("all time");

  const filterGroups = [
    {
      itemColumn: "status",
      items: [
        { title: "All statuses", value: undefined },
        { title: "Completed", value: "completed" },
        { title: "Pending", value: "pending" },
        { title: "Failed", value: "failed" },
        { title: "Blocked", value: "blocked" },
      ],
    },
    {
      itemColumn: "dateRange",
      items: [
        { title: "All time", value: undefined },
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

  const handleFilterSelect = (columnName: string, value: string | undefined, itemTitle: string) => {
    setSelectedTitles((prev) => ({ ...prev, [columnName]: itemTitle }));

    switch (columnName) {
      case "dateRange":
        setSelectedDateRange(value ?? "all time");
        break;
      default:
        break;
    }
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
