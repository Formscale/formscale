"use client";

import Link from "next/link";

import { Form } from "@formhook/types";
import { DotsHorizontalIcon, EyeNoneIcon, EyeOpenIcon, Link1Icon, StackIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { DropdownItem, DropdownSkeleton } from "@/components/default-dropdown";
import DashBadge from "../components/badge";
import { FormatDate, FormatNumber, SortButton } from "../components/table/columns";

export const columns: ColumnDef<Form>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => SortButton("Name", column),
    cell: ({ row }) => {
      const form = row.original;

      return (
        <div className="flex items-center gap-3">
          <StackIcon className="min-w-4 min-h-4 w-4 h-4 text-muted-foreground" />
          <Link href={`/forms/${form.id}`} className="hover:underline">
            {form.name}
          </Link>
        </div>
      );
    },
  },
  {
    id: "visibility",
    accessorFn: (row) => row.settings.isPublic,
    header: "Visibility",
    cell: ({ row }) => {
      const form = row.original;

      return form.settings.isPublic ? (
        <DashBadge variant="action">
          <EyeOpenIcon className="h-4 w-4" />
          Active
        </DashBadge>
      ) : (
        <DashBadge variant="secondary">
          <EyeNoneIcon className="h-4 w-4" />
          Disabled
        </DashBadge>
      );
    },
  },
  {
    accessorKey: "submissions.length",
    header: ({ column }) => SortButton("Submissions", column),
    cell: ({ row }) => {
      const form = row.original;
      return FormatNumber(form.submissions.length);
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <div className="text-right">{SortButton("Created", column)}</div>,
    cell: ({ row }) => {
      const form = row.original;
      return FormatDate(form.createdAt);
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <div className="text-right">{SortButton("Last updated", column)}</div>,
    cell: ({ row }) => {
      const form = row.original;
      return FormatDate(form.updatedAt);
    },
    filterFn: (row, columnId, filterValue: Date | undefined) => {
      if (!filterValue) return true;
      const rowDate = new Date(row.getValue(columnId));
      return rowDate >= filterValue;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form = row.original;

      const dropdownItems = [
        { title: "View submissions", url: `/forms/${form.id}/submissions` },
        { title: "Settings", url: `/forms/${form.id}/settings` },
        { title: "Delete form", url: `/forms/${form.id}/delete` },
      ];

      return (
        <DropdownSkeleton
          button={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          }
        >
          <DropdownItem
            item={{
              title: "Copy endpoint",
              icon: Link1Icon,
              onClick: () => navigator.clipboard.writeText(`${window.location.origin}/forms/${form.id}`),
            }}
          />
          <DropdownMenuSeparator />
          {dropdownItems.map((item) => (
            <DropdownItem key={item.title} item={item} />
          ))}
        </DropdownSkeleton>
      );
    },
  },
];
