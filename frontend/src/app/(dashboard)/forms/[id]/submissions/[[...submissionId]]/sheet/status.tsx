"use client";

import { FormSkeleton } from "@/components/default-dialog";
import { useFetch } from "@/hooks/fetch";
import { useError } from "@/providers/error";
import { useForm as useFormProvider } from "@/providers/form";
import { EditStatus, EditStatusSchema, SubmissionSent } from "@formscale/types";
import { uppercase } from "@formscale/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function StatusSwitch({ submission }: { submission: SubmissionSent }) {
  const { refreshForm } = useFormProvider();
  const { handleError, handleToast } = useError();
  const { put } = useFetch();

  const form = useForm<EditStatus>({
    resolver: zodResolver(EditStatusSchema),
    defaultValues: {
      status: submission.status || "completed",
    },
  });

  if (!submission) return null;

  const status = form.watch("status");

  useEffect(() => {
    if (!form.formState.isDirty) return;

    const submitForm = async () => {
      try {
        const values = form.getValues();

        const response = await put("submissions/:id/status", values, {
          params: { id: submission.id },
        });

        if (response.success) {
          handleToast("success", `Submission status updated to "${uppercase(values.status)}".`);
        }

        refreshForm();
      } catch (err) {
        handleError({
          message: "Failed to update status",
          description: (err as Error).message,
        });
      }
    };

    submitForm();
  }, [status]);

  const fields = [
    {
      name: "status",
      type: "select",
      placeholder: "completed",
      options: ["completed", "pending", "blocked", "failed"],
    },
  ];

  return <FormSkeleton form={form} fields={fields} />;
}
