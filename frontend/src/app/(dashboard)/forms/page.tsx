import DashTitle from "../components/title";
import DashCard from "../components/card";
import FormButton from "@/components/form-button";
import { DataTable } from "../components/table";
import { columns, formData } from "./columns";

export default function FormsPage() {
  return (
    <>
      <DashTitle title="Forms" />
      <DashCard title="No forms yet." description="Create and manage your forms here.">
        <FormButton variant="default" />
      </DashCard>
      <DataTable columns={columns} data={formData} />
    </>
  );
}
