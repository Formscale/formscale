"use client";

import { Progress, ProgressVariant } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface Limits {
  name: string;
  value: number;
  total: number;
  variant?: ProgressVariant;
}

interface UsageProps {
  limits: Limits[];
  title?: string;
  muted?: boolean;
  children?: React.ReactNode;
}

export function UsageSection({ limits, title, children, muted }: UsageProps) {
  return (
    <div className="flex justify-between items-start gap-16">
      <div className="flex">{children}</div>

      <div className="space-y-4 w-full max-w-lg">
        {title && (
          <div className="mb-4 flex">
            <span className={cn("text-[0.8rem]", muted && "text-muted-foreground")}>{title}</span>
          </div>
        )}

        <UsageItems limits={limits} />
      </div>
    </div>
  );
}

function getProgressValue(value: number, total: number) {
  return total === 0 ? 0 : (value / total) * 100;
}

export default function UsageItems({ limits }: { limits: Limits[] }) {
  return (
    <>
      {limits.map((lim, index) => (
        <div
          key={index}
          className={cn(
            "flex w-full items-center justify-between gap-4 border-b-[0.5px] border-border pb-4",
            index === limits.length - 1 && "border-b-0"
          )}
        >
          <div className="flex gap-4 items-center w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full max-w-[100px]">
                  <Progress
                    variant={!lim.variant ? (lim.value >= lim.total ? "blocked" : "default") : lim.variant}
                    value={getProgressValue(lim.value, lim.total)}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="py-1 px-2 border border-border bg-background mt-0.5">
                  <span className="text-xs text-foreground/80">
                    {Math.round(getProgressValue(lim.value, lim.total)).toLocaleString()}%
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-xs whitespace-nowrap">{lim.name}</span>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {lim.value.toLocaleString()} / {lim.total.toLocaleString()}
          </span>
        </div>
      ))}
    </>
  );
}
