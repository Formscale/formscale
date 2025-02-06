import DashTitle from "../components/title";
import DashCard from "../components/card";
import FormButton from "@/components/form-button";

export default function IntegrationsPage() {
  return (
    <>
      <DashTitle title="Integrations" />
      <DashCard
        title="No services added."
        description="Connect your forms to external services to automate your workflows."
      >
        <FormButton variant="default" />
      </DashCard>
    </>
  );
}
