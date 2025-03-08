"use client";

import { Form, SubmissionSent } from "@formscale/types";
import Link from "next/link";

import DashCard from "@/app/(dashboard)/components/card";
import { DataCardButton, DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import Metric from "@/app/(dashboard)/components/metric";
import { Limits, UsageSection } from "@/app/(dashboard)/components/usage-item";
import { Input } from "@/components/ui/input";
import { handleCopy } from "@/lib/utils";
import { useForm } from "@/providers/form";
import { Button } from "@formscale/ui/components";
import { LinkNone2Icon } from "@radix-ui/react-icons";
import { CardTitle } from "../../../../components/ui/card";

const filterStatus = (submissions: SubmissionSent[], status: string) => {
  return submissions.filter((submission) => submission.status === status);
};

// const filterDate = (submissions: SubmissionSent[], date: string) => {
//   return submissions.filter((submission) => submission.createdAt.toISOString().split("T")[0] === date);
// };

function FormInsights({ form }: { form: Form }) {
  const submissions = form?.submissions;
  const length = submissions?.length;

  if (!submissions || !length)
    return (
      <DashCard
        title="Form insights"
        description="No submissions yet - get started by adding the endpoint to your form!"
      >
        <Button variant="action" className="w-full" size="sm" asChild>
          <Link href={`/onboarding/${form.id}`}>
            <LinkNone2Icon />
            <span className="text-xs font-bold">View Setup</span>
          </Link>
        </Button>
      </DashCard>
    );

  const status: Limits[] = [
    {
      name: "Completed",
      variant: "success",
      value: filterStatus(submissions, "completed").length,
      total: length,
    },
    {
      name: "Pending",
      variant: "default",
      value: filterStatus(submissions, "pending").length,
      total: length,
    },
    {
      name: "Blocked",
      variant: "blocked",
      value: filterStatus(submissions, "blocked").length,
      total: length,
    },
    {
      name: "Failed",
      variant: "destructive",
      value: filterStatus(submissions, "failed").length,
      total: length,
    },
  ];

  return (
    <DataCardSkeleton title="Form insights">
      <UsageSection limits={status} title="Status" muted>
        <Metric
          range="last 30 days"
          value={
            form.submissions?.filter(
              (submission) => new Date(submission.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length || 0
          }
        />
      </UsageSection>
    </DataCardSkeleton>
  );
}

export default function FormPage() {
  const { form } = useForm();

  if (!form) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      <FormInsights form={form} />

      <DataCardButton
        titleHeader={<CardTitle className="text-md font-bold">Endpoint</CardTitle>}
        buttonText="Copy Endpoint"
        onClickAction={() => handleCopy(`${process.env.NEXT_PUBLIC_API_URL}/s/${form.id}`, "Endpoint")}
        text={
          <>
            Copy this endpoint to use in your form.{" "}
            <Link href={`/onboarding/${form.id}`} className="underline text-muted-foreground">
              See guide.
            </Link>{" "}
          </>
        }
      >
        <Input
          type="text"
          placeholder={`${process.env.NEXT_PUBLIC_API_URL}/s/${form.id}`}
          value={`${process.env.NEXT_PUBLIC_API_URL}/s/${form.id}`}
          disabled
          className="max-w-sm"
        />
      </DataCardButton>
    </div>
  );
}
