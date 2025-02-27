import DefaultSheet from "@/app/(dashboard)/components/sheet";
import { FormatCell } from "@/app/(dashboard)/components/table/columns";
import { Form, SubmissionSent } from "@formhook/types";
import { uppercase } from "@formhook/utils";
import { format } from "date-fns";
import { FieldValues } from "react-hook-form";
import LogsContent from "./logs";

export function SubmissionItem({ label, value }: { label: string; value: FieldValues[keyof FieldValues] }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-xs text-muted-foreground">{uppercase(label)}</span>
      <span className="text-[0.8rem]">{FormatCell(value)}</span>
    </div>
  );
}

function SheetContent({ submission, form }: { submission: SubmissionSent; form: Form }) {
  return (
    <>
      <div className="grid gap-4 mt-4 w-full">
        <h2 className="text-xs font-bold">Response</h2>
        {Object.entries(submission.data).map(([key, value]) => (
          <SubmissionItem key={key} label={key} value={value} />
        ))}
      </div>
      <div className="grid gap-4 mt-6">
        <h2 className="text-xs font-bold">Metadata</h2>
        <SubmissionItem label="Origin" value={submission.site} />
        <SubmissionItem label="Locality" value={submission.location} />
      </div>
      <div className="grid gap-4 mt-6">
        <h2 className="text-xs font-bold">Logs</h2>
        <LogsContent submission={submission} />
      </div>
    </>
  );
}

export default function SubmissionSheet({
  trigger,
  submission,
  form,
}: {
  trigger: React.ReactNode;
  submission: SubmissionSent;
  form: Form;
}) {
  const index = form.submissions?.findIndex((s) => s.id === submission.id) || 0;

  return (
    <DefaultSheet
      trigger={trigger}
      rowData={submission}
      title={`Submission #${index + 1}`}
      description={`Submitted at ${format(new Date(submission.createdAt), "h:mm a 'on' MMMM do, yyyy")}.`}
    >
      <SheetContent submission={submission} form={form} />
    </DefaultSheet>
  );
}
