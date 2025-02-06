import DashTitle from "../components/title";
import DashCard from "../components/card";
import FormButton from "@/components/form-button";

export default function DomainsPage() {
  return (
    <>
      <DashTitle title="Domains" />
      <DashCard title="No domains yet." description="Set a custom domain for your forms.">
        <FormButton variant="default" />
      </DashCard>
    </>
  );
}
