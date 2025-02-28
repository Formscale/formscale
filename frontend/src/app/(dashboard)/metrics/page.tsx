"use client";

import { useEffect, useState } from "react";

import Loading from "@/components/loading";
import { useForms } from "@/providers";
import { DashCardSkeleton } from "../components/card";
import Chart from "../components/chart/chart";
import { Filter } from "../components/chart/filter";
import Metric from "../components/metric";
import DashTitle from "../components/title";
// yeah this code doesn't work
// i'll fix it
// maybe

// should add logic to filter component instead

interface ChartDataPoint {
  date: string;
  pending: number;
  completed: number;
  failed: number;
  blocked: number;
}

export default function MetricsPage() {
  const { forms, isLoading } = useForms();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [sortedData, setSortedData] = useState<ChartDataPoint[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all time");

  useEffect(() => {
    const submissions = forms
      .flatMap((form) => form.submissions)
      .reduce(
        (acc, submission) => {
          if (!submission) return acc;
          const date = new Date(submission.createdAt);
          const dateKey = date.toISOString().slice(0, 7);

          if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, pending: 0, completed: 0, failed: 0, blocked: 0 };
          }
          acc[dateKey][submission.status]++;
          return acc;
        },
        {} as Record<string, { date: string; pending: number; completed: number; failed: number; blocked: number }>
      );

    const sortedData = Object.values(submissions).sort((a, b) => a.date.localeCompare(b.date));
    setSortedData(sortedData);
    setChartData(sortedData);
  }, [forms]);

  if (isLoading) return <Loading />;

  return (
    <>
      <DashTitle title="Metrics">
        <Filter forms={forms} />
      </DashTitle>
      <DashCardSkeleton>
        <div className="flex flex-col gap-4 w-full p-6 pt-5 pb-4">
          <Metric
            range={selectedDateRange}
            value={chartData.reduce((acc, item) => acc + item.pending + item.completed + item.failed + item.blocked, 0)}
          />
          <Chart data={chartData} />
        </div>
      </DashCardSkeleton>
    </>
  );
}
