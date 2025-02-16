"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";

const getVariantClasses = (variant: string, isRoot: boolean = false) => {
  const opacity = isRoot ? (variant === "destructive" ? "10" : "20") : "";
  const baseClasses = {
    default: `bg-formhook${isRoot ? `/${opacity}` : ""}`,
    secondary: `bg-secondary${isRoot ? `/${opacity}` : ""}`,
    destructive: `bg-destructive${isRoot ? `/${opacity}` : ""}`,
    success: `bg-green-300${isRoot ? `/${opacity}` : ""}`,
    blocked: `bg-destructive${isRoot ? `/${opacity}` : "/80"}`,
  };
  return baseClasses[variant as keyof typeof baseClasses] || baseClasses.default;
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: "default" | "secondary" | "destructive" | "success" | "blocked";
  }
>(({ className, value, variant = "default", ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-formhook/20",
      getVariantClasses(variant, true),
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-formhook transition-all", getVariantClasses(variant))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
