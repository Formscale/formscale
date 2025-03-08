"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@formscale/ui/components";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export interface ChartDataPoint {
  date: string;
  pending: number;
  completed: number;
  failed: number;
  blocked: number;
}

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--success))",
    // color: "hsl(var(--formscale))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--formscale)/0.6)",
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

export default function Chart({ data }: { data: ChartDataPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[350px] w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            try {
              if (value.includes("T")) {
                const [datePart, hourPart] = value.split("T");
                const date = new Date(`${datePart}T${hourPart}:00:00`);
                return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
              } else if (value.length === 10) {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              } else {
                const [year, month] = value.split("-");
                const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
              }
            } catch (e) {
              console.error(e);
              return value;
            }
          }}
          interval="preserveEnd"
          minTickGap={40}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          orientation="right"
          allowDecimals={false}
          domain={["dataMin", "dataMax"]}
        />
        <ChartTooltip content={<ChartTooltipContent className="font-heading-pro" />} />
        {/* <ChartLegend content={<ChartLegendContent />} /> */}
        <Bar dataKey="completed" fill="var(--color-completed)" radius={[6, 6, 0, 0]} barSize={10} />
        <Bar dataKey="pending" fill="var(--color-pending)" radius={[6, 6, 0, 0]} barSize={10} />
        <Bar dataKey="blocked" fill="var(--color-blocked)" radius={[6, 6, 0, 0]} barSize={10} />
        <Bar dataKey="failed" fill="var(--color-failed)" radius={[6, 6, 0, 0]} barSize={10} />
      </BarChart>
    </ChartContainer>
  );
}
