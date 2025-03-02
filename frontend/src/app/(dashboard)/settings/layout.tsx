import DashTitle from "@/app/(dashboard)/components/title";
import Tabs from "@/components/tabs";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const basePath = `/settings`;

  const tabs = [
    { title: "Usage", href: basePath },
    { title: "Team", href: `${basePath}/team` },
    { title: "Billing", href: `${basePath}/billing` }, // change to stripe billing page
    // add more stuff future maybe
  ];

  return (
    <>
      <DashTitle title="Settings" />
      <Tabs tabs={tabs} basePath={basePath} />
      {children}
    </>
  );
}
