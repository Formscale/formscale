"use client";

import { SubmissionSent } from "@formhook/types";

import DashCard from "@/app/(dashboard)/components/card";
import FormButton from "@/components/form-button";
import { DataTable } from "@/app/(dashboard)/components/table/table";
import { ExportButton } from "./export-button";
import { getColumns } from "./columns";
import { useForm } from "@/providers/form";

const getFirstDataField = (submissions: SubmissionSent[]) => {
  if (submissions.length === 0) return "data.name";
  const firstSubmission = submissions[0];
  const firstField = Object.keys(firstSubmission.data || {})[0];
  return `data.${firstField}`;
};

export default function FormsPage() {
  const { form } = useForm();

  if (!form) return null;

  const submissions = form.submissions || [];
  const columns = getColumns(submissions);

  const handleRowClick = (row: SubmissionSent) => {
    console.log(row);
  };

  const filterProps = {
    column: getFirstDataField(submissions),
    select: true,
    children: <ExportButton form={form} />,
    items: [
      // {
      //   itemColumn: "status",
      //   items: [
      //     { title: "All statuses", value: undefined },
      //     { title: "Pending", value: "pending" },
      //     { title: "Completed", value: "completed" },
      //     { title: "Failed", value: "failed" },
      //     { title: "Blocked", value: "blocked" },
      //   ],
      // },
      {
        itemColumn: "createdAt",
        items: [
          { title: "All time", value: undefined },
          { title: "Last 30 days", value: "last_30_days" },
          { title: "Last 7 days", value: "last_7_days" },
          { title: "Last 24 hours", value: "last_24_hours" },
        ],
      },
    ],
  };

  return (
    <>
      {!submissions && (
        <DashCard title="No forms yet." description="Create and manage your forms here.">
          <FormButton variant="default" />
        </DashCard>
      )}
      <DataTable columns={columns} data={submissions} onClickAction={handleRowClick} filterProps={filterProps} />
    </>
  );
}
