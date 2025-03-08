"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ProgressVariant = "default" | "secondary" | "destructive" | "success" | "blocked";

const variantClassesMap = {
  default: {
    root: "bg-formscale/20",
    indicator: "bg-formscale",
  },
  secondary: {
    root: "bg-secondary/20",
    indicator: "bg-secondary",
  },
  destructive: {
    root: "bg-destructive/10",
    indicator: "bg-destructive",
  },
  success: {
    root: "bg-green-300/20",
    indicator: "bg-green-300",
  },
  blocked: {
    root: "bg-destructive/20",
    indicator: "bg-destructive/80",
  },
} as const;

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: ProgressVariant;
  }
>(({ className, value, variant = "default", ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full", variantClassesMap[variant].root, className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 transition-all", variantClassesMap[variant].indicator)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
