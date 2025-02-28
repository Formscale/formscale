import { uppercase } from "@formhook/utils";
import { FieldValues } from "react-hook-form";
import { FormatCell } from "./table/columns";

export default function SubmissionItem({
  label,
  value,
  uppercaseLabel = true,
}: {
  label: string;
  value: FieldValues[keyof FieldValues];
  uppercaseLabel?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-xs text-muted-foreground">{uppercaseLabel ? uppercase(label) : label}</span>
      <span className="text-[0.8rem]">{FormatCell(value)}</span>
    </div>
  );
}
