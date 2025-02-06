import Link from "next/link";

import DashTitle from "@/app/(dashboard)/components/title";
import Tabs from "@/components/tabs";
import { formData } from "@/lib/test-data";
import DashCard from "@/app/(dashboard)/components/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export default async function FormLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const { id } = await params;
  const form = formData.find((form) => form.id === id);

  if (!form) {
    return (
      <DashCard
        title="Form not found."
        description="Please ensure the form exists and you have the correct permissions."
      >
        <Button className="w-full" size="sm" asChild>
          <Link href="/forms">
            <ChevronLeftIcon />
            <span className="text-xs font-bold">Go back</span>
          </Link>
        </Button>
      </DashCard>
    );
  }

  const basePath = `/forms/${id}`;
  const tabs = [
    { title: "Overview", href: basePath },
    { title: "Submissions", href: `${basePath}/submissions` },
    { title: "Hooks", href: `${basePath}/hooks` },
    { title: "Rules", href: `${basePath}/rules` },
    { title: "Settings", href: `${basePath}/settings` },
  ];

  return (
    <>
      <DashTitle title={form?.name || "Your form"} />
      <Tabs tabs={tabs} />
      {children}
    </>
  );
}
