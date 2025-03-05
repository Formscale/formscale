import SubmissionItem from "@/app/(dashboard)/components/submission-item";
import Loading from "@/components/loading";
import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers/error";
import { Log, SubmissionSent } from "@formscale/types";
import { format } from "date-fns";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function LogsContent({ submission }: { submission: SubmissionSent }) {
  const { get } = useFetch();
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useError();

  // const defaultLog: Log = {
  //   id: submission.id,
  //   submissionId: submission.id,
  //   createdAt: submission.createdAt,
  //   updatedAt: submission.updatedAt,
  //   type: "submission" as const,
  //   data: submission.data,
  //   message: "Submission created",
  //   code: 200,
  // };

  const fetchLogs = useCallback(async () => {
    if (!isLoading) return;

    try {
      const response = await get("logs/submissions/:id", {
        params: { id: submission.id },
      });

      if (response.success && response.data?.logs) {
        // const logs: Log[] = response.data.logs.sort(
        //   (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        // );

        setLogs(response.data.logs);
      }
    } catch (err) {
      handleError({
        message: "Failed to fetch logs",
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (isLoading)
    return (
      <div className="flex justify-center items-start h-full -mt-36">
        <Loading size="mini" />
      </div>
    );

  if (!logs || logs.length === 0) {
    return <SubmissionItem label="N/A" value="No logs found" log={true} />;
  }

  return (
    <>
      {logs.map((log, index) => (
        <Link href={`/logs/${log.id}`} key={index}>
          <SubmissionItem
            // label={format(new Date(log.createdAt), "MM/dd/yyyy 'at' h:mm:ss a")}
            label={format(new Date(log.createdAt), "h:mm:ss a")}
            value={`${log.code} - ${log.message}`}
            log={true}
          />
        </Link>
      ))}
    </>
  );
}
