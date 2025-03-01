"use client";

import { Log } from "@formhook/types";

import Loading from "@/components/loading";
import { useLogs } from "@/providers";
import { useRouter } from "next/navigation";
import DashCard from "../components/card";
import RefreshButton from "../components/refresh-button";
import { DataTable } from "../components/table/table";
import DashTitle from "../components/title";
import { getColumns } from "./columns";

const filterProps = {
  column: "submissionId",
  globalSearch: true,
  items: [
    {
      itemColumn: "code",
      items: [
        { title: "All codes", value: undefined },
        { title: "Success (200)", value: 200 },
        { title: "Redirect (302)", value: 302 },
        { title: "Bad Request (400)", value: 400 },
        { title: "Unauthorized (401)", value: 401 },
        { title: "Forbidden (403)", value: 403 },
        { title: "Not Found (404)", value: 404 },
        { title: "Server Error (500)", value: 500 },
      ],
    },
    {
      itemColumn: "updatedAt",
      items: [
        { title: "All time", value: undefined },
        { title: "Last 30 days", value: "last_30_days" },
        { title: "Last 7 days", value: "last_7_days" },
        { title: "Last 24 hours", value: "last_24_hours" },
      ],
    },
  ],
};

export function LogsContent() {
  const router = useRouter();
  const { logs, isLoading } = useLogs();

  const columns = getColumns(logs || []);

  const handleRowClick = (row: Log) => {
    router.push(`/logs/${row.id}`);
  };

  if (isLoading) return <Loading />;

  console.log(logs);

  if (logs?.length === 0) {
    return (
      <DashCard
        title="No logs yet."
        description="Collect submissions to start monitoring webhooks, emails, and more."
      ></DashCard>
    );
  }

  return (
    <>
      <DataTable columns={columns} data={logs || []} onClickAction={handleRowClick} filterProps={filterProps} />
    </>
  );
}

export default function LogsLayout() {
  const { refreshLogs } = useLogs();

  return (
    <>
      <DashTitle title="Logs">
        <RefreshButton refresh={refreshLogs} type="logs" />
      </DashTitle>
      <LogsContent />
    </>
  );
}
