"use client";

import { Form } from "@formhook/types";

import FormButton from "@/components/form-button";
import { formData } from "@/lib/test-data";
import { useRouter } from "next/navigation";
import DashCard from "../components/card";
import { DataTable } from "../components/table/table";
import DashTitle from "../components/title";
import { columns } from "./columns";
const filterProps = {
  column: "name",
  items: [
    {
      itemColumn: "visibility",
      items: [
        { title: "All visibility", value: undefined },
        { title: "Public", value: true },
        { title: "Private", value: false },
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

export default function FormsPage() {
  const router = useRouter();
  const handleRowClick = (row: Form) => {
    router.push(`/forms/${row.id}`);
  };

  return (
    <>
      <DashTitle title="Forms" />
      {!formData && (
        <DashCard title="No forms yet." description="Create and manage your forms here.">
          <FormButton variant="default" />
        </DashCard>
      )}
      <DataTable columns={columns} data={formData} onClickAction={handleRowClick} filterProps={filterProps} />
    </>
  );
}

// todo:
// x pagination
// x table row should be a link
// x reusable table, columns, and filters
// x sidebar footer should use default-dropdown
// - create tables for submissions, logs, and domains
// - shadcn sheets for specific field/table data
// x finish template card for data & use in settings
// - replace button & link with link inside button asChild
// - add form settings to the schema instead of saved as json string
// - dark mode light mode
// - work on mobile

// /forms/id
// - add metrics/live monitor to form
// x submissions table
// x filter submissions table headers
// 1/2 webhook & zod/schema validation
// - sheet for full submission data
// - special formatting for data (ex: left align numbers, etc)
// - search submissions from all parameters
// - disable "save changes" button if no changes
// - add delete section in form settings

// settings
// - add members to settings - add/remove members, see status, etc
// - addons?
