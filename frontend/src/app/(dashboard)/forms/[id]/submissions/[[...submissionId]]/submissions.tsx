"use client";

import { SubmissionSent } from "@formscale/types";

import DashCard from "@/app/(dashboard)/components/card";
import { DataTable } from "@/app/(dashboard)/components/table/table";
import { useForm } from "@/providers/form";
import { useEffect, useState } from "react";
import { useSubmissionColumns } from "./columns";
import { ExportButton } from "./export-button";
import SubmissionSheet from "./sheet/sheet";

const getFirstDataField = (submissions: SubmissionSent[]) => {
  if (submissions.length === 0) return "data.name";
  const firstSubmission = submissions[0];
  const firstField = Object.keys(firstSubmission.data || {})[0];
  return `data.${firstField}`;
};

export default function Submissions({ id }: { id?: string }) {
  const { form } = useForm();
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionSent | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (id && form?.submissions) {
      const submission = form.submissions.find((s: SubmissionSent) => s.id == id);
      if (submission) {
        setSelectedSubmission(submission);
        setIsSheetOpen(true);
      }
    }
  }, [id, form?.submissions]);

  const submissions = form?.submissions || [];
  const columns = useSubmissionColumns(submissions);

  if (!form) return null;

  const handleRowClick = (row: SubmissionSent) => {
    history.pushState(null, "", `/forms/${form.id}/submissions/${row.id}`);
  };

  const filterProps = {
    column: getFirstDataField(submissions),
    globalSearch: true,
    select: true,
    children: <ExportButton form={form} />,
    items: [
      // {
      //   itemColumn: "status",
      //   items: [
      //     { title: "All statuses", value: undefined },
      //     { title: "Completed", value: "completed" },
      //     { title: "Pending", value: "pending" },
      //     { title: "Blocked", value: "blocked" },
      //     { title: "Failed", value: "failed" },
      //   ],
      // },
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

  return (
    <>
      {submissions.length === 0 ? (
        <DashCard title="No submissions yet." description="Get started by collecting submissions."></DashCard>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={submissions}
            onClickAction={handleRowClick}
            filterProps={filterProps}
            WrapperComponent={({ trigger, rowData }) => (
              <SubmissionSheet trigger={trigger} submission={rowData} form={form} />
            )}
          />

          {selectedSubmission && (
            <SubmissionSheet
              trigger={<span className="hidden" />}
              submission={selectedSubmission}
              form={form}
              open={isSheetOpen}
              setOpen={(open) => {
                setIsSheetOpen(open);
                if (!open) setSelectedSubmission(null);
              }}
            />
          )}
        </>
      )}
    </>
  );
}
