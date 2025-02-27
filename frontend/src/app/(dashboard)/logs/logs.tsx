// "use client";

// import { Form } from "@formhook/types";

// import Loading from "@/components/loading";
// import { useLogs } from "@/providers";
// import { useRouter } from "next/navigation";
// import DashCard from "../components/card";
// import { DataTable } from "../components/table/table";
// import { getColumns } from "../forms/columns";

// const filterProps = {
//   column: "name",
//   items: [
//     // {
//     //   itemColumn: "status",
//     //   items: [
//     //     { title: "All statuses", value: undefined },
//     //     { title: "Pending", value: "pending" },
//     //     { title: "Completed", value: "completed" },
//     //     { title: "Failed", value: "failed" },
//     //     { title: "Blocked", value: "blocked" },
//     //   ],
//     // },
//     {
//       itemColumn: "updatedAt",
//       items: [
//         { title: "All time", value: undefined },
//         { title: "Last 30 days", value: "last_30_days" },
//         { title: "Last 7 days", value: "last_7_days" },
//         { title: "Last 24 hours", value: "last_24_hours" },
//       ],
//     },
//   ],
// };

// export default function FormsContent() {
//   const router = useRouter();
//   const { logs, isLoading } = useLogs();

//   const columns = getColumns(logs);

//   const handleRowClick = (row: Form) => {
//     router.push(`/forms/${row.id}`);
//   };

//   if (isLoading) return <Loading />;

//   if (logs?.length === 0) {
//     return (
//       <DashCard
//         title="No logs yet."
//         description="Collect submissions to start monitoring webhooks, emails, and more."
//       ></DashCard>
//     );
//   }

//   return <DataTable columns={columns} data={logs} onClickAction={handleRowClick} filterProps={filterProps} />;
// }
