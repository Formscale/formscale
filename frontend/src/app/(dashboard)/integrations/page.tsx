import DashTitle from "../components/title";
import DashCard from "../components/card";

export default function IntegrationsPage() {
  return (
    <>
      <DashTitle title="Integrations" />
      <DashCard
        // title="No services added."
        title="Integrations coming soon."
        description="Connect your forms to 30+ external services to automate your workflows."
      ></DashCard>
    </>
  );
}
