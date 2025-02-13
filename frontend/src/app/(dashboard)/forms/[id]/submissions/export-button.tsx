import { Button } from "@/components/ui/button";
import DefaultDropdown from "@/components/default-dropdown";
import { DownloadIcon } from "@radix-ui/react-icons";

import { Form } from "@formhook/types";

import { getDataFields } from "./columns";

export function ExportButton({ form }: { form: Form }) {
  const exportData = (type: "csv" | "json") => {
    const submissions = form.submissions || [];
    if (submissions.length === 0) return;

    const headers = ["id", "createdAt", "status", ...getDataFields(submissions)];
    const data = submissions.map((sub) => ({
      id: sub.id,
      createdAt: sub.createdAt,
      status: sub.status,
      ...sub.data,
    }));

    const filename = form.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    if (type === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      downloadBlob(blob, `${filename}.json`);
    } else {
      const csv = [
        headers.join(","),
        ...data.map((row) => headers.map((header) => JSON.stringify(row[header as keyof typeof row] ?? "")).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      downloadBlob(blob, `${filename}.csv`);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const items = [
    { title: "CSV", value: "csv", onClick: () => exportData("csv") },
    { title: "JSON", value: "json", onClick: () => exportData("json") },
  ];

  return (
    <DefaultDropdown items={items}>
      <Button variant="outline">
        <DownloadIcon />
        <span className="text-xs">Export</span>
      </Button>
    </DefaultDropdown>
  );
}
