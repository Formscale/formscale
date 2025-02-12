import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import DashBadge from "../badge";
// import { FieldValues } from "react-hook-form";
import { DotsHorizontalIcon, CheckIcon, Cross2Icon, CaretSortIcon, CrossCircledIcon } from "@radix-ui/react-icons";

export function FormatDate(date: Date) {
  return (
    <div className="text-right" title={format(date, "MMM d, yyyy")}>
      {formatDistanceToNow(date, { addSuffix: true }).replace("about ", "")}
    </div>
  );
}

export function FormatNumber(number: number) {
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

  return <div className="text-right">{formatNumber(number)}</div>;
}

export function SortButton<T>(title: string, column: Column<T>) {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      <span className="text-xs">{title}</span>
      <CaretSortIcon />
    </Button>
  );
}

// export function FormatCell(value: FieldValues[keyof FieldValues], type?: string) {
//   switch (type) {
//     case "number":
//       return <div className="text-right font-mono tabular-nums">{new Intl.NumberFormat().format(value)}</div>;

//     case "currency":
//       return (
//         <div className="text-right font-mono tabular-nums">
//           {new Intl.NumberFormat("en-US", {
//             style: "currency",
//             currency: "USD",
//           }).format(value)}
//         </div>
//       );

//     case "percentage":
//       return <div className="text-right font-mono tabular-nums">{value}%</div>;

//     case "code":
//       return <div className="font-mono text-xs bg-muted p-1 rounded">{value}</div>;

//     case "email":
//       return <div className="font-mono text-xs text-muted-foreground">{value}</div>;

//     default:
//       return <div>{value}</div>;
//   }
// }

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
    case "blocked":
      return (
        <DashBadge variant="destructive">
          <CrossCircledIcon className="h-4 w-4" />
          Blocked
        </DashBadge>
      );
  }
}
