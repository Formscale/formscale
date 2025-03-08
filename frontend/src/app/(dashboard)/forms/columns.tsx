"use client";

import Link from "next/link";

import { Form } from "@formscale/types";
import { DotsHorizontalIcon, EyeNoneIcon, EyeOpenIcon, Link1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@formscale/ui/components";

import { DeleteDialog } from "@/components/default-dialog";
import { DropdownItem, DropdownSkeleton } from "@/components/default-dropdown";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useDelete } from "@/hooks/use-delete";
import { handleCopy } from "@/lib/utils";
import { useForms } from "@/providers";
import DashBadge from "../components/badge";
import { FormatDate, FormatNumber, SortButton } from "../components/table/columns";

export function useSubmissionColumns(forms: Form[]): ColumnDef<Form>[] {
  const { deleteItem } = useDelete();
  const { refreshForms } = useForms();

  return [
    {
      accessorKey: "name",
      header: ({ column }) => SortButton("Name", column),
      cell: ({ row }) => {
        const form = row.original;

        return (
          <div className="flex items-center gap-3 pl-4">
            {/* <StackIcon className="min-w-4 min-h-4 w-4 h-4 text-muted-foreground" /> */}
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
        return FormatNumber(form?.submissions?.length ?? 0);
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
      sortingFn: "datetime",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const form = row.original;

        const dropdownItems = [
          { title: "View submissions", url: `/forms/${form.id}/submissions` },
          { title: "Settings", url: `/forms/${form.id}/settings` },
          {
            title: "Delete form",
            dialog: (
              <DeleteDialog
                title={`Delete ${form.name}?`}
                buttonText={`Delete Form & All Associated Data`}
                onDeleteAction={async () => {
                  await deleteItem("forms/:id/delete", { id: form.id }, { onSuccess: refreshForms });
                }}
              />
            ),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
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
                  onClick: () => handleCopy(`${window.location.origin}/forms/${form.id}`, "Endpoint"),
                }}
              />
              <DropdownMenuSeparator />
              {dropdownItems.map((item) => (
                <DropdownItem key={item.title} item={item} />
              ))}
            </DropdownSkeleton>
          </div>
        );
      },
    },
  ];
}
