import DashTitle from "../components/dash-title";
import DashCard from "../components/dash-card";
import FormButton from "@/components/form-button";

export default function FormsPage() {
  return (
    <>
      <DashTitle title="Forms" />
      <DashCard title="No forms yet." description="Create and manage your forms here.">
        <FormButton variant="default" />
      </DashCard>
    </>
  );
}
