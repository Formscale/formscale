"use client";

import { useLayoutEffect, useState } from "react";

import { useError } from "@/providers";
import { Form } from "@formhook/types";

import FormButton from "@/components/form-button";
import Loading from "@/components/loading";
import { useFetch } from "@/hooks/fetch";
import { useRouter } from "next/navigation";
import DashCard from "../components/card";
import { DataTable } from "../components/table/table";
import { columns } from "./columns";

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
  const { get, isLoading, error } = useFetch();
  const [forms, setForms] = useState<Form[]>([]);
  const { handleError } = useError();

  useLayoutEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await get("forms/all");

        if (response.data?.forms) {
          setForms(response.data.forms);
        }
      } catch (error) {
        handleError({ message: "Failed to fetch forms", description: (error as Error).message });

        console.error("Failed to fetch forms:", error);
      }
    };

    fetchForms();
  }, []);

  const handleRowClick = (row: Form) => {
    router.push(`/forms/${row.id}`);
  };

  if (isLoading || forms.length === 0) return <Loading />;

  if (forms.length === 0 || error) {
    return (
      <DashCard title="No forms yet." description="Create and manage your forms here.">
        <FormButton variant="default" />
      </DashCard>
    );
  }

  return <DataTable columns={columns} data={forms} onClickAction={handleRowClick} filterProps={filterProps} />;
}
