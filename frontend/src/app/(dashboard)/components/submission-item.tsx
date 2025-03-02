import { uppercase } from "@formhook/utils";
import { FieldValues } from "react-hook-form";
import { FormatCell } from "./table/columns";

export default function SubmissionItem({
  label,
  value,
  uppercaseLabel = true,
  log = false,
}: {
  label: string;
  value: FieldValues[keyof FieldValues];
  uppercaseLabel?: boolean;
  log?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 w-full ${log ? "border-l border-border pl-4 py-2 pb-3 relative items-start" : ""}`}
    >
      {log && (
        <div className="absolute -left-3 top-5.5 bg-background rounded-full w-6 h-6 flex items-center justify-center">
          <div className="border border-border rounded-full w-3 h-3"></div>
        </div>
      )}
      <span className="text-xs text-muted-foreground">{uppercaseLabel ? uppercase(label) : label}</span>
      <span className="text-[0.8rem]">{FormatCell(value)}</span>
    </div>
  );
}
