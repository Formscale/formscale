import DefaultSheet from "@/app/(dashboard)/components/sheet";
import SubmissionItem from "@/app/(dashboard)/components/submission-item";
import { Form, SubmissionSent } from "@formhook/types";
import { format } from "date-fns";
import LogsContent from "./logs";
import StatusSwitch from "./status";

function SheetContent({ submission }: { submission: SubmissionSent }) {
  return (
    <>
      <div className="w-full">
        <StatusSwitch submission={submission} />
      </div>
      <div className="grid gap-4 mt-6">
        <h2 className="text-xs font-bold -mb-1">Response</h2>
        {Object.keys(submission.data).length > 0 ? (
          Object.entries(submission.data).map(([key, value]) => <SubmissionItem key={key} label={key} value={value} />)
        ) : (
          <SubmissionItem label="N/A" value="Blank submission" />
        )}
      </div>
      <div className="grid gap-4 mt-6">
        <h2 className="text-xs font-bold -mb-1">Metadata</h2>
        <SubmissionItem label="Origin" value={submission.site} />
        <SubmissionItem label="Locality" value={submission.location} />
      </div>
      <div className="grid mt-6">
        <h2 className="text-xs font-bold mb-3">Logs</h2>
        <LogsContent submission={submission} />
      </div>
    </>
  );
}

interface SubmissionSheetProps {
  submission: SubmissionSent;
  form: Form;
  trigger: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export default function SubmissionSheet({ trigger, submission, form, open, setOpen }: SubmissionSheetProps) {
  const index = form.submissions?.findIndex((s) => s.id === submission.id) || 0;

  return (
    <DefaultSheet
      trigger={trigger}
      rowData={submission}
      title={`Submission #${index + 1}`}
      description={`Submitted at ${format(new Date(submission.createdAt), "h:mm a 'on' MMMM do, yyyy")}.`}
      open={open}
      setOpen={setOpen}
    >
      <SheetContent submission={submission} />
    </DefaultSheet>
  );
}
