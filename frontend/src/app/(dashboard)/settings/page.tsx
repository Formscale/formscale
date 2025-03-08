"use client";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import { UsageSection } from "@/app/(dashboard)/components/usage-item";
import { useForms, useUser } from "@/providers";
import { SubscriptionTier, TierLimits, Usage } from "@formscale/types";
import { Button } from "@formscale/ui/components";

export default function UsagePage() {
  const { forms } = useForms();
  const { user } = useUser();

  const currentTier = user?.subscriptionTier ?? SubscriptionTier.FREE;

  const usage: Usage = {
    forms: forms.length,
    submissions: forms.reduce((acc, form) => acc + (form.submissions?.length ?? 0), 0),
    members: new Set(forms.flatMap((form) => form.settings.admins?.map((admin) => admin.email) || [])).size,
    maxForms: TierLimits[currentTier]?.maxForms ?? 0,
    maxSubmissionsPerMonth: TierLimits[currentTier]?.maxSubmissionsPerMonth ?? 0,
    maxMembers: TierLimits[currentTier]?.maxMembers ?? 0,
  };

  const limits = [
    {
      name: "Forms",
      value: usage.forms,
      total: usage.maxForms,
    },
    {
      name: "Submissions Per Month",
      value: usage.submissions,
      total: usage.maxSubmissionsPerMonth,
    },
    {
      name: "Members",
      value: usage.members,
      total: usage.maxMembers,
    },
  ];

  // set unlimited in development
  // change color in production?
  // reorder to completed, pending, blocked, failed

  return (
    <div className="w-full flex flex-col gap-6">
      <DataCardSkeleton
        title="Forms"
        button={
          <Button className="w-fit" size="sm">
            <span className="font-bold text-xs">Upgrade</span>
          </Button>
        }
      >
        <UsageSection limits={limits} title="Free">
          <span className="text-[0.8rem]">Formscale is currently free to use. Contact for higher limits.</span>
        </UsageSection>
      </DataCardSkeleton>
    </div>
  );
}
