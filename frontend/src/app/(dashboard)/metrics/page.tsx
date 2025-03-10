"use client";

import { useEffect, useState } from "react";

import Loading from "@/components/loading";
import { useForms } from "@/providers";
import { SubmissionSent } from "@formscale/types";
import { DashCardSkeleton } from "../components/card";
import Chart, { ChartDataPoint } from "../components/chart/chart";
import { Filter, Filters } from "../components/chart/filter";
import Metric from "../components/metric";
import DashTitle from "../components/title";

export default function MetricsPage() {
  const { forms, isLoading } = useForms();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [filters, setFilters] = useState<Filters>({
    dateRange: "last_30_days",
    formId: undefined,
    status: undefined,
  });

  useEffect(() => {
    if (!forms || forms.length === 0) return;

    const submissions = forms
      .flatMap((form) => form.submissions?.map((sub: SubmissionSent) => ({ ...sub, formId: form.id })) || [])
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
        {} as Record<string, ChartDataPoint>
      );

    const sortedData = Object.values(submissions).sort((a, b) =>
      (a as ChartDataPoint).date.localeCompare((b as ChartDataPoint).date)
    );
    setChartData(sortedData as ChartDataPoint[]);
  }, [forms]);

  useEffect(() => {
    if (!forms || forms.length === 0) return;

    let filteredSubmissions = forms.flatMap(
      (form) => form.submissions?.map((sub: SubmissionSent) => ({ ...sub, formId: form.id })) || []
    );

    if (filters.formId) {
      filteredSubmissions = filteredSubmissions.filter((sub: SubmissionSent) => sub.formId === filters.formId);
    }

    const now = new Date();
    const dateRangeConfig = {
      last_24_hours: { days: 1, format: "hour", interval: 60 * 60 * 1000 },
      last_7_days: { days: 7, format: "day", interval: 24 * 60 * 60 * 1000 },
      last_30_days: { days: 30, format: "day", interval: 24 * 60 * 60 * 1000 },
    };

    const config = filters.dateRange ? dateRangeConfig[filters.dateRange as keyof typeof dateRangeConfig] : null;
    const dateFormat = config?.format || "month";
    const startDate = config ? new Date(now.getTime() - config.days * 24 * 60 * 60 * 1000) : new Date(0);

    filteredSubmissions = filteredSubmissions.filter((sub) => new Date(sub.createdAt) >= startDate);

    const formatDateKey = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");

      if (dateFormat === "hour") return `${year}-${month}-${day}T${hour}`;
      if (dateFormat === "day") return `${year}-${month}-${day}`;
      return `${year}-${month}`;
    };

    const allDates: Record<string, ChartDataPoint> = {};

    if (config) {
      const count = dateFormat === "hour" ? 24 : config.days;
      for (let i = 0; i < count; i++) {
        const date = new Date(now.getTime() - i * config.interval);
        const dateKey = formatDateKey(date);
        allDates[dateKey] = { date: dateKey, pending: 0, completed: 0, failed: 0, blocked: 0 };
      }
    } else {
      if (filteredSubmissions.length === 0) {
        const dateKey = formatDateKey(now);
        allDates[dateKey] = { date: dateKey, pending: 0, completed: 0, failed: 0, blocked: 0 };
      } else {
        const oldestDate = filteredSubmissions.reduce(
          (oldest, sub) => Math.min(oldest, new Date(sub.createdAt).getTime()),
          now.getTime()
        );
        const oldestDateObj = new Date(oldestDate);

        const currentDate = new Date(oldestDateObj.getFullYear(), oldestDateObj.getMonth(), 1);
        while (currentDate <= now) {
          const dateKey = formatDateKey(currentDate);
          allDates[dateKey] = { date: dateKey, pending: 0, completed: 0, failed: 0, blocked: 0 };
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
    }

    filteredSubmissions.forEach((submission) => {
      if (!submission) return;
      const dateKey = formatDateKey(new Date(submission.createdAt));
      if (allDates[dateKey]) {
        allDates[dateKey][submission.status as keyof ChartDataPoint]++;
      }
    });

    const sortedData = Object.values(allDates).sort((a, b) => a.date.localeCompare(b.date));

    if (filters.status) {
      const status = filters.status as keyof ChartDataPoint;
      sortedData.forEach((dataPoint) => {
        const statusCount = dataPoint[status] as number;
        dataPoint.pending = 0;
        dataPoint.completed = 0;
        dataPoint.failed = 0;
        dataPoint.blocked = 0;
        dataPoint[status] = statusCount as never;
      });
    }

    setChartData(sortedData);
  }, [forms, filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  if (isLoading) return <Loading />;

  const parseDateRange = (dateRange: string) => {
    return dateRange.replace(/_/g, " ");
  };

  const totalSubmissions = chartData.reduce(
    (acc, item) => acc + item.pending + item.completed + item.failed + item.blocked,
    0
  );

  return (
    <>
      <DashTitle title="Metrics">
        <Filter forms={forms} onFilterChangeAction={handleFilterChange} />
      </DashTitle>
      <DashCardSkeleton>
        <div className="flex flex-col gap-4 w-full p-6 pt-5 pb-4">
          <Metric range={parseDateRange(filters.dateRange || "last 30 days")} value={totalSubmissions} />
          <Chart data={chartData} />
        </div>
      </DashCardSkeleton>
    </>
  );
}
