"use client";

import Link from "next/link";

import DashCard from "@/app/(dashboard)/components/card";
import DashTitle from "@/app/(dashboard)/components/title";
import Loading from "@/components/loading";
import SuspenseWrapper from "@/components/suspense-wrapper";
import Tabs from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { useForm } from "@/providers/form";
import { ReloadIcon, TriangleLeftIcon } from "@radix-ui/react-icons";

export function LayoutContent({ children, id }: { children: React.ReactNode; id: string }) {
  const { form, isLoading, refreshForm } = useForm();

  if (isLoading) return <Loading />;

  if (!form) {
    return (
      <DashCard
        title="Form not found."
        description="Please ensure the form exists and you have the correct permissions."
      >
        <Button className="w-full" size="sm" asChild>
          <Link href="/forms">
            <TriangleLeftIcon />
            <span className="text-xs font-bold">Go Back</span>
          </Link>
        </Button>
      </DashCard>
    );
  }

  const basePath = `/forms/${id}`;
  const tabs = [
    { title: "Overview", href: basePath },
    { title: "Submissions", href: `${basePath}/submissions` },
    { title: "Builder", href: `${basePath}/builder` },
    { title: "Hooks", href: `${basePath}/hooks` },
    { title: "Settings", href: `${basePath}/settings` },
  ];

  return (
    <>
      <DashTitle title={form?.name || "Your form"}>
        <Button size="sm" variant="outline" onClick={() => refreshForm()}>
          <ReloadIcon />
        </Button>
      </DashTitle>
      <Tabs tabs={tabs} />
      {children}
    </>
  );
}

export default function FormLayoutContent({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <LayoutContent id={id}>
      <SuspenseWrapper>{children}</SuspenseWrapper>
    </LayoutContent>
  );
}
