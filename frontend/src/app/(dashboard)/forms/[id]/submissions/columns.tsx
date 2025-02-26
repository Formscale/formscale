"use client";

import { SubmissionSent } from "@formhook/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { FormatCell, FormatDate, SortButton, StatusBadge } from "@/app/(dashboard)/components/table/columns";
import { DeleteDialog } from "@/components/default-dialog";
import { DropdownItem, DropdownSkeleton } from "@/components/default-dropdown";
import { useDelete } from "@/hooks/use-delete";
import { useForm } from "@/providers";
import { uppercase } from "@formhook/utils";
// import CheckboxColumn from "@/app/(dashboard)/components/table/checkbox";

export const getDataFields = (submissions: SubmissionSent[]) => {
  const fields = new Set<string>();
  submissions.forEach((submission) => {
    Object.keys(submission.data || {}).forEach((key) => fields.add(key));
  });
  return Array.from(fields);
};

export function getColumns(submissions: SubmissionSent[]): ColumnDef<SubmissionSent>[] {
  const { deleteItem } = useDelete();
  const { refreshForm } = useForm();

  const dataFields = getDataFields(submissions);

  const dataColumns: ColumnDef<SubmissionSent>[] = dataFields.map((field, index) => ({
    id: `data.${field}`,
    accessorKey: `data.${field}`,
    header: ({ column }) => SortButton(uppercase(field), column),
    cell: ({ row }) => <div className={"pl-4"}>{FormatCell(row.original.data[field])}</div>,
  }));

  return [
    // CheckboxColumn(),
    ...dataColumns,
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: "Status",
      cell: ({ row }) => {
        const submission = row.original;

        return <StatusBadge status={submission.status} />;
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: ({ column }) => <div className="text-right">{SortButton("Created", column)}</div>,
    //   cell: ({ row }) => {
    //     const submission = row.original;
    //     return FormatDate(submission.createdAt);
    //   },
    // },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <div className="text-right">{SortButton("Last updated", column)}</div>,
      cell: ({ row }) => {
        const submission = row.original;
        return FormatDate(submission.updatedAt);
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
        const submission = row.original;
        // console.log(submission);

        const dropdownItems = [
          { title: "View details", onClick: () => console.log("view details") },
          {
            title: "Delete submission",
            onClick: () => console.log("delete submission"),
            dialog: (
              <DeleteDialog
                title="Delete submission?"
                onDeleteAction={async () => {
                  await deleteItem("submissions/:id/delete", { id: submission.id }, { onSuccess: refreshForm });
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
