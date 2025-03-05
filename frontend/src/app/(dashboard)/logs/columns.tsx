"use client";

import Link from "next/link";

import { Form, Log, SubmissionSent } from "@formscale/types";
import { DotsHorizontalIcon, EnvelopeClosedIcon, LayersIcon, Link1Icon, TokensIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { DropdownItem, DropdownSkeleton } from "@/components/default-dropdown";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { handleCopy } from "@/lib/utils";
import { useForms } from "@/providers";
import { uppercase } from "@formscale/utils";
import DashBadge from "../components/badge";
import { FormatDate, SortButton } from "../components/table/columns";

function getLogIcon(type: Log["type"]) {
  switch (type) {
    case "submission":
      return <LayersIcon className="min-w-4 min-h-4 w-4 h-4 text-muted-foreground" />;
    case "webhook":
      return <TokensIcon className="min-w-4 min-h-4 w-4 h-4 text-muted-foreground" />;
    case "email":
      return <EnvelopeClosedIcon className="min-w-4 min-h-4 w-4 h-4 text-muted-foreground" />;
  }
}

export function getForm(forms: Form[], submissionId: string) {
  const form = forms?.find((form) =>
    form.submissions?.some((submission: SubmissionSent) => submission.id === submissionId)
  );
  return form;
}

export function getLogVariant(log: Log) {
  return log.code >= 200 && log.code < 300 ? "success" : log.code >= 300 && log.code < 400 ? "action" : "destructive";
}

export function getColumns(logs: Log[]): ColumnDef<Log>[] {
  const { forms } = useForms();

  return [
    {
      accessorKey: "type",
      header: ({ column }) => SortButton("Type", column),
      cell: ({ row }) => {
        const log = row.original;

        return (
          <div className="flex items-center gap-3 pl-4">
            {/* {getLogIcon(log.type)} */}
            <Link href={`/logs/${log.id}`} className="hover:underline">
              {uppercase(log.type)}
            </Link>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "submissionId",
    //   header: ({ column }) => "Submission ID",
    //   cell: ({ row }) => {
    //     const log = row.original;

    //     const form = getForm(forms, log.submissionId);

    //     return (
    //       <div onClick={(e) => e.stopPropagation()}>
    //         <Link href={`/forms/${form?.id}/submissions/${log.submissionId}`} className="hover:underline">
    //           {log.submissionId.slice(10)}...
    //         </Link>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "form",
    //   header: ({ column }) => "Form",
    //   cell: ({ row }) => {
    //     const log = row.original;

    //     const form = getForm(forms, log.submissionId);

    //     return (
    //       <div onClick={(e) => e.stopPropagation()}>
    //         <Link href={`/forms/${form?.id}`} className="hover:underline whitespace-nowrap">
    //           {form?.name}
    //         </Link>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "id",
      header: ({}) => {
        return null;
      },
      cell: ({}) => {
        return null;
      },
    },
    {
      id: "code",
      accessorFn: (row) => row.code,
      header: ({ column }) => SortButton("Code", column, true),
      cell: ({ row }) => {
        const log = row.original;

        const variant = getLogVariant(log);

        return <DashBadge variant={variant}>{log.code}</DashBadge>;
      },
      filterFn: (row, columnId, filterValue: number | undefined) => {
        if (!filterValue) return true;
        const rowValue = row.getValue(columnId);
        return rowValue === filterValue;
      },
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => {
        const log = row.original;

        return log.message ?? "No message.";
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <div className="text-right">{SortButton("Created", column)}</div>,
      cell: ({ row }) => {
        const log = row.original;
        return FormatDate(log.createdAt);
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <div className="text-right">{SortButton("Last updated", column)}</div>,
      cell: ({ row }) => {
        const log = row.original;
        return FormatDate(log.updatedAt);
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
        const log = row.original;
        const form = getForm(forms, log.submissionId);

        const dropdownItems = [
          {
            title: "View submission",
            url: `/forms/${form?.id}/submissions/${log.submissionId}`,
          },
          {
            title: "View form",
            url: `/forms/${form?.id}`,
          },
          { title: "View log", url: `/logs/${log.id}` },
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
                  title: "Copy ID",
                  icon: Link1Icon,
                  onClick: () => handleCopy(log.id, "ID"),
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
