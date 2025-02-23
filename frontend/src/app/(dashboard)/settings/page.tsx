"use client";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import { UsageSection } from "@/app/(dashboard)/components/usage-item";
import { Button } from "@/components/ui/button";
import { SubscriptionTier, TierLimits, Usage } from "@formhook/types";

export default function UsagePage() {
  const currentTier = SubscriptionTier.FREE;

  const usage: Usage = {
    forms: 2,
    submissions: 50,
    members: 1,
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

  return (
    <div className="w-full flex flex-col gap-6">
      <DataCardSkeleton
        title="Forms"
        button={
          <Button className="w-fit">
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
