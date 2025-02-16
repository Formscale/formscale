"use client";

import { formData } from "@/lib/test-data";
import { useEffect, useState } from "react";

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
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [sortedData, setSortedData] = useState<ChartDataPoint[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all time");

  useEffect(() => {
    const submissions = formData
      .flatMap((form) => form.submissions)
      .reduce(
        (acc, submission) => {
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
  }, []);

  const handleFilterChange = (filters: { dateRange?: string; formName?: string; status?: string }) => {
    let filteredData = [...sortedData];

    if (filters.formName) {
      const form = formData.find((f) => f.id === filters.formName);
      if (form) {
        const formSubmissions = form.submissions.reduce(
          (acc, submission) => {
            const date = submission.createdAt.toISOString().slice(0, 7);
            if (!acc[date]) {
              acc[date] = { date, pending: 0, completed: 0, failed: 0, blocked: 0 };
            }
            acc[date][submission.status]++;
            return acc;
          },
          {} as Record<string, ChartDataPoint>
        );

        filteredData = Object.values(formSubmissions).sort((a, b) => a.date.localeCompare(b.date));
      }
    }

    if (filters.dateRange) {
      setSelectedDateRange(filters.dateRange.replace(/_/g, " "));

      const now = new Date();
      const cutoffDate = new Date();
      let dateInterval = "month";

      switch (filters.dateRange) {
        case "last_24_hours":
          cutoffDate.setDate(now.getDate() - 1);
          dateInterval = "hour";
          break;
        case "last_7_days":
          cutoffDate.setDate(now.getDate() - 7);
          dateInterval = "day";
          break;
        case "last_30_days":
          cutoffDate.setDate(now.getDate() - 30);
          dateInterval = "day";
          break;
      }

      const allDates: ChartDataPoint[] = [];
      const currentDate = new Date(cutoffDate);

      while (currentDate <= now) {
        const dateStr =
          dateInterval === "hour" ? currentDate.toISOString().slice(0, 13) : currentDate.toISOString().slice(0, 10);

        allDates.push({
          date: dateStr,
          pending: 0,
          completed: 0,
          failed: 0,
          blocked: 0,
        });

        if (dateInterval === "hour") {
          currentDate.setHours(currentDate.getHours() + 1);
        } else if (dateInterval === "day") {
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      const dataMap = new Map(filteredData.map((item) => [item.date, item]));
      filteredData = allDates.map((date) => {
        const existingData = dataMap.get(date.date);
        return existingData || date;
      });
    } else {
      setSelectedDateRange("all time");
    }

    if (filters.status) {
      const statusMap = {
        pending: filters.status === "pending",
        completed: filters.status === "completed",
        failed: filters.status === "failed",
        blocked: filters.status === "blocked",
      };

      filteredData = filteredData.map((item) => ({
        date: item.date,
        pending: statusMap.pending ? item.pending : 0,
        completed: statusMap.completed ? item.completed : 0,
        failed: statusMap.failed ? item.failed : 0,
        blocked: statusMap.blocked ? item.blocked : 0,
      }));
    }

    setChartData(filteredData);
  };

  return (
    <>
      <DashTitle title="Metrics">
        <Filter onFilterChangeAction={handleFilterChange} forms={formData} />
      </DashTitle>
      <DashCardSkeleton>
        <div className="flex flex-col gap-4 w-full p-6 pt-5">
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
