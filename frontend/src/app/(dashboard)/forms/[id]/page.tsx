"use client";

import { Form, SubmissionSent } from "@formhook/types";
import Link from "next/link";

import DashCard from "@/app/(dashboard)/components/card";
import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import Metric from "@/app/(dashboard)/components/metric";
import { Limits, UsageSection } from "@/app/(dashboard)/components/usage-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleCopy } from "@/lib/utils";
import { useForm } from "@/providers/form";
import { LinkNone2Icon } from "@radix-ui/react-icons";

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
          <Link href="/onboarding">
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
      name: "Failed",
      variant: "destructive",
      value: filterStatus(submissions, "failed").length,
      total: length,
    },
    {
      name: "Blocked",
      variant: "blocked",
      value: filterStatus(submissions, "blocked").length,
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
      <DataCardSkeleton
        title="Endpoint"
        button={
          <Button
            type="submit"
            size="sm"
            onClick={() => handleCopy(`${process.env.NEXT_PUBLIC_API_URL}/s/${form.id}`, "Endpoint")}
          >
            <span className="text-xs font-bold">Copy Endpoint</span>
          </Button>
        }
      >
        <div className="space-y-2">
          <div className="flex">
            <span className="text-[0.8rem]">
              Copy this endpoint to use in your form.{" "}
              <Link target="_blank" href="/onboarding" className="underline text-muted-foreground">
                See guide.
              </Link>{" "}
            </span>
          </div>
          <Input
            type="text"
            placeholder={`${process.env.NEXT_PUBLIC_API_URL}/s/${form.id}`}
            value={`${process.env.NEXT_PUBLIC_API_URL}/s/${form.id}`}
            disabled
            className="max-w-sm"
          />
        </div>
      </DataCardSkeleton>
    </div>
  );
}
