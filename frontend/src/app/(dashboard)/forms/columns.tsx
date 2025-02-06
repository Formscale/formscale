"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Form } from "@formhook/types";
import {
  DotsHorizontalIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  CaretSortIcon,
  StackIcon,
  Link1Icon,
} from "@radix-ui/react-icons";
import { format, formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import DashBadge from "../components/badge";
import { DropdownItem, DropdownSkeleton } from "@/components/default-dropdown";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export const formData: Form[] = [
  {
    id: "1",
    name: "Dris Elamri's Form",
    settings: {
      isPublic: true,
      allowAnonymous: true,
      admins: ["dris@formhook.com"],
      successUrl: "https://formhook.com",
      customDomain: "https://formhook.com",
    },
    submissions: [
      {
        formId: "1",
        id: "1",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
        data: {},
      },
    ],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "2",
    name: "Dris Elamri's Form 2",
    settings: {
      isPublic: true,
      allowAnonymous: true,
      admins: ["dris@formhook.com"],
      successUrl: "https://formhook.com",
      customDomain: "https://formhook.com",
    },
    submissions: [
      {
        formId: "2",
        id: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        data: {},
      },
      {
        formId: "2",
        id: "2",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
        data: {},
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

function FormatDate(date: Date) {
  return (
    <div className="text-right" title={format(date, "MMM d, yyyy")}>
      {formatDistanceToNow(date, { addSuffix: true }).replace("about ", "")}
    </div>
  );
}

function SortButton<T>(title: string, column: Column<T>) {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      <span className="text-xs">{title}</span>
      <CaretSortIcon />
    </Button>
  );
}

export const columns: ColumnDef<Form>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => SortButton("Name", column),
    cell: ({ row }) => {
      const form = row.original;

      return (
        <div className="flex items-center gap-3">
          <StackIcon className="h-4 w-4 text-muted-foreground" />
          {form.name}
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
          Public
        </DashBadge>
      ) : (
        <DashBadge variant="secondary">
          <EyeNoneIcon className="h-4 w-4" />
          Private
        </DashBadge>
      );
    },
  },
  {
    accessorKey: "submissions.length",
    header: ({ column }) => SortButton("Submissions", column),
    cell: ({ row }) => {
      const form = row.original;
      return <div className="text-right">{form.submissions.length}</div>;
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
    header: ({ column }) => <div className="text-right">{SortButton("Last modified", column)}</div>,
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

      const items = [
        { title: "View submissions", url: `/forms/${form.id}/submissions` },
        { title: "Settings", url: `/forms/${form.id}/settings` },
        { title: "Delete form", url: `/forms/${form.id}/delete` },
      ];

      return (
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-8 p-0">
        //       <span className="sr-only">Open menu</span>
        //       <DotsHorizontalIcon className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end">
        //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //     <DropdownMenuItem onClick={() => navigator.clipboard.writeText(form.id)}>Copy URL</DropdownMenuItem>
        //     <DropdownMenuSeparator />
        //     <DropdownMenuItem>View submissions</DropdownMenuItem>
        //     <DropdownMenuItem>Settings</DropdownMenuItem>
        //     <DropdownMenuItem>Delete form</DropdownMenuItem>
        //   </DropdownMenuContent>
        // </DropdownMenu>

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
              title: "Copy URL",
              icon: Link1Icon,
              onClick: () => navigator.clipboard.writeText(`${window.location.origin}/forms/${form.id}`),
            }}
          />
          <DropdownMenuSeparator />
          {items.map((item) => (
            <DropdownItem key={item.title} item={item} />
          ))}
        </DropdownSkeleton>
      );
    },
  },
];
