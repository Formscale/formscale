import DefaultDropdown from "@/components/default-dropdown";
import { Button } from "@formscale/ui/components";
import { DownloadIcon } from "@radix-ui/react-icons";

import { Form, SubmissionSent } from "@formscale/types";

import { getDataFields } from "./columns";

export function exportData(type: "csv" | "json", formSubmissions?: SubmissionSent[], form?: Form) {
  const submissions = formSubmissions || form?.submissions || [];
  if (submissions.length === 0) return;

  const headers = ["id", "createdAt", "status", ...getDataFields(submissions)];
  const data = submissions.map((sub) => ({
    id: sub.id,
    status: sub.status,
    ...sub.data,
    site: sub.site,
    location: sub.location,
    updatedAt: sub.updatedAt,
    createdAt: sub.createdAt,
  }));

  const formName = form?.name || submissions[0].id || "form";
  const filename = formName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

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
}

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

export function ExportButton({ formSubmissions, form }: { formSubmissions?: SubmissionSent[]; form?: Form }) {
  const items = [
    { title: "CSV", value: "csv", onClick: () => exportData("csv", formSubmissions, form) },
    { title: "JSON", value: "json", onClick: () => exportData("json", formSubmissions, form) },
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
