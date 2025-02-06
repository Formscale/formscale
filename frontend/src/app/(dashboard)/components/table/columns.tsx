import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import DashBadge from "../badge";
import { DotsHorizontalIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

export function FormatDate(date: Date) {
  return (
    <div className="text-right" title={format(date, "MMM d, yyyy")}>
      {formatDistanceToNow(date, { addSuffix: true }).replace("about ", "")}
    </div>
  );
}

export function SortButton<T>(title: string, column: Column<T>) {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      <span className="text-xs">{title}</span>
      <CaretSortIcon />
    </Button>
  );
}

export function FormatNumber(number: number) {
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

  return <div className="text-right">{formatNumber(number)}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <DashBadge variant="secondary">
          <DotsHorizontalIcon className="h-4 w-4" />
          Pending
        </DashBadge>
      );
    case "completed":
      return (
        <DashBadge variant="success">
          <CheckIcon className="h-4 w-4" />
          Completed
        </DashBadge>
      );
    case "failed":
      return (
        <DashBadge variant="destructive">
          <Cross2Icon className="h-4 w-4" />
          Failed
        </DashBadge>
      );
  }
}
