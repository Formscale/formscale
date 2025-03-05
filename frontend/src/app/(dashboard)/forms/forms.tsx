"use client";

import { Form } from "@formscale/types";

import FormButton from "@/components/form-button";
import Loading from "@/components/loading";
import { useForms } from "@/providers";
import { useRouter } from "next/navigation";
import DashCard from "../components/card";
import { DataTable } from "../components/table/table";
import { useSubmissionColumns } from "./columns";

const filterProps = {
  column: "name",
  items: [
    {
      itemColumn: "visibility",
      items: [
        { title: "All visibilities", value: undefined },
        { title: "Active", value: true },
        { title: "Disabled", value: false },
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

export default function FormsContent() {
  const router = useRouter();
  const { forms, isLoading } = useForms();

  const columns = useSubmissionColumns(forms);

  const handleRowClick = (row: Form) => {
    router.push(`/forms/${row.id}`);
  };

  if (isLoading) return <Loading />;

  if (forms.length === 0) {
    return (
      <DashCard title="No forms yet." description="Create and manage your forms here.">
        <FormButton variant="default" />
      </DashCard>
    );
  }

  return <DataTable columns={columns} data={forms} onClickAction={handleRowClick} filterProps={filterProps} />;
}
