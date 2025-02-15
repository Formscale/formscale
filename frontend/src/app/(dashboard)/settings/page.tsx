"use client";

import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Usage } from "@formhook/types";

interface Limits {
  name: string;
  value: number;
  limit: number;
}

interface UsageItemProps {
  name: string;
  index: number;
  value: number;
  limit: number;
  limits: Limits[];
}

function UsageItem({ name, index, value, limit, limits }: UsageItemProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4 border-b-[0.5px] border-border pb-4",
        index === limits.length - 1 && "border-b-0"
      )}
    >
      <div className="flex gap-4 items-center w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full max-w-[100px]">
              <Progress value={(value / limit) * 100} />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="text-xs text-secondary-foreground">{Math.round((value / limit) * 100)}%</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-xs whitespace-nowrap">{name}</span>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {value} / {limit}
      </span>
    </div>
  );
}

export default function UsagePage() {
  const usage: Usage = {
    forms: 2,
    submissions: 50,
  };

  const tierLimits = {
    maxForms: 3,
    maxSubmissionsPerMonth: 100,
  };

  const limits = [
    {
      name: "Forms",
      value: usage.forms,
      limit: tierLimits.maxForms,
    },
    {
      name: "Submissions Per Month",
      value: usage.submissions,
      limit: tierLimits.maxSubmissionsPerMonth,
    },
  ];

  return (
    <DataCardSkeleton
      title="Forms"
      button={
        <Button className="w-fit">
          <span className="font-bold text-xs">Upgrade</span>
        </Button>
      }
    >
      <div className="flex justify-between items-start gap-16">
        <div className="flex">
          <span className="text-[0.8rem]">FormHook is currently free to use. Contact for higher limits.</span>
        </div>

        <div className="space-y-4 w-full max-w-lg">
          <div className="mb-4 flex">
            <span className="text-[0.8rem]">Free</span>
          </div>

          {limits.map((lim, index) => (
            <UsageItem key={index} {...lim} limits={limits} index={index} />
          ))}
        </div>
      </div>
    </DataCardSkeleton>
  );
}
