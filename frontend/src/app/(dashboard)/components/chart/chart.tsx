"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--success))",
    // color: "hsl(var(--formhook))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--formhook)/0.6)",
  },
  blocked: {
    label: "Blocked",
    color: "hsl(var(--destructive)/0.8)",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export default function Chart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[350px] w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value);
            if (date.toLocaleDateString("en-US").length > 10) {
              return date.toLocaleTimeString("en-US", { hour: "2-digit" });
            }
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
          // interval={"preserveStartEnd"}
          minTickGap={50}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          orientation="right"
          allowDecimals={false}
          domain={["dataMin", "dataMax"]}
        />
        <ChartTooltip content={<ChartTooltipContent className="font-heading-pro" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={[6, 6, 0, 0]} barSize={10} />
        <Bar dataKey="pending" fill="var(--color-pending)" radius={[6, 6, 0, 0]} barSize={10} />
        <Bar dataKey="failed" fill="var(--color-failed)" radius={[6, 6, 0, 0]} barSize={10} />
        <Bar dataKey="blocked" fill="var(--color-blocked)" radius={[6, 6, 0, 0]} barSize={10} />
      </BarChart>
    </ChartContainer>
  );
}
