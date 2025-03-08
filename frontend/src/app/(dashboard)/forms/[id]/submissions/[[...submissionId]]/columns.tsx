"use client";

import { SubmissionSent } from "@formscale/types";
import { DotsHorizontalIcon, Link1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@formscale/ui/components";

import { FormatCell, FormatDate, SortButton, StatusBadge } from "@/app/(dashboard)/components/table/columns";
import { DeleteDialog } from "@/components/default-dialog";
import { DropdownItem, DropdownSkeleton } from "@/components/default-dropdown";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useDelete } from "@/hooks/use-delete";
import { handleCopy } from "@/lib/utils";
import { useForm } from "@/providers";
import { uppercase } from "@formscale/utils";
import { exportData } from "./export-button";

// import CheckboxColumn from "@/app/(dashboard)/components/table/checkbox";

export const getDataFields = (submissions: SubmissionSent[]) => {
  const fields = new Set<string>();
  submissions.forEach((submission) => {
    Object.keys(submission.data || {}).forEach((key) => fields.add(key));
  });
  return Array.from(fields);
};

function DropdownWrapper({ children, index }: { children: React.ReactNode; index: number }) {
  // this might be my best code ever
  if (index !== 0) {
    return <div onClick={(e) => e.stopPropagation()}>{children}</div>;
  }

  return <>{children}</>;
}

export function useSubmissionColumns(submissions: SubmissionSent[]): ColumnDef<SubmissionSent>[] {
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
      id: "id",
      accessorFn: (row) => row.id,
      header: ({ column }) => {
        return null;
      },
      cell: ({ row }) => {
        return null;
      },
    },
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
          { title: "View details" },
          { title: "Export CSV", onClick: () => exportData("csv", [submission]) },
          { title: "Export JSON", onClick: () => exportData("json", [submission]) },
          {
            title: "Delete",
            dialog: (
              <DeleteDialog
                title="Delete submission?"
                buttonText="Delete Submission, Logs, & Associated Data"
                onDeleteAction={async () => {
                  await deleteItem("submissions/:id/delete", { id: submission.id }, { onSuccess: refreshForm });
                }}
              />
            ),
          },
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
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownItem
                item={{
                  title: "Copy ID",
                  icon: Link1Icon,
                  onClick: () => handleCopy(`${submission.id}`, "Submission ID"),
                }}
              />
            </div>
            <DropdownMenuSeparator />
            {dropdownItems.map((item, index) => (
              <DropdownWrapper key={index} index={index}>
                <DropdownItem item={item} />
              </DropdownWrapper>
            ))}
          </DropdownSkeleton>
        );
      },
    },
  ];
}
