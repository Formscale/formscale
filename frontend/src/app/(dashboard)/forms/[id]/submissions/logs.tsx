import Loading from "@/components/loading";
import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers/error";
import { Log, SubmissionSent } from "@formhook/types";
import { format } from "date-fns";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SubmissionItem } from "./sheet";

export default function LogsContent({ submission }: { submission: SubmissionSent }) {
  const { get } = useFetch();
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useError();

  const defaultLog: Log = {
    id: submission.id,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    type: "submission" as const,
    data: submission.data,
    message: "Submission created",
    code: 200,
  };

  const fetchLogs = useCallback(async () => {
    if (!isLoading) return;

    try {
      const response = await get("logs/submissions/:id", {
        params: { id: submission.id },
      });

      if (response.success && response.data?.logs) {
        const logs: Log[] = [...response.data.logs, defaultLog].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setLogs(logs);
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
      <div className="flex justify-center items-start h-full">
        <Loading size="mini" />
      </div>
    );

  return (
    <>
      {logs &&
        logs.length > 0 &&
        logs.map((log, index) => (
          <Link href={`/logs/${log.id}`} key={index}>
            <SubmissionItem
              label={format(new Date(log.createdAt), "MM/dd/yyyy 'at' h:mm a")}
              value={`${log.code} - ${log.message}`}
            />
          </Link>
        ))}
    </>
  );
}
