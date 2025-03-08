"use client";

import CodeSwitcher from "@/components/code-switcher";
import FormButton from "@/components/form-button";
import Loading from "@/components/loading";
import { useForms } from "@/providers";
import { Form } from "@formscale/types";
import { Button, DefaultSelect } from "@formscale/ui/components";
import { RocketIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashTitle from "../../components/title";

function OnboardingStep({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-l border-border pl-8 py-6 pb-4 relative items-start">
      <div className="absolute -left-3 top-5.5 bg-background rounded-full w-6 h-6 flex items-center justify-center">
        <div className="border border-border rounded-full w-3 h-3"></div>
      </div>
      <h3 className="text-md font-bold">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{description}</p>
      {children}
    </div>
  );
}

export default function OnboardingContent({ id }: { id?: string }) {
  const { forms, isLoading } = useForms();
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const form = forms.find((f) => f.id === id[0]);

      if (form) {
        setSelectedForm(form);
      }
    }
  }, [forms, id]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col w-full max-w-4xl">
      <DashTitle title="Onboarding" />
      <span className="text-xs text-muted-foreground mb-6">
        Follow these steps to send your first submission with Formscale.
      </span>

      {forms.length === 0 ? (
        <OnboardingStep title="Add a form" description="Start by creating a form to collect submissions.">
          <div className="flex w-fit">
            <FormButton variant="default" />
          </div>
        </OnboardingStep>
      ) : (
        <OnboardingStep title="Choose a form" description="Select one of your forms to continue setup.">
          <div className="flex w-full max-w-xs">
            <DefaultSelect
              options={forms.map((f) => f.name)}
              field={{
                value: selectedForm?.name || "",
                onChange: (value: string) => {
                  const form = forms.find((f) => f.name === value);
                  if (form) setSelectedForm(form);
                },
              }}
              placeholder="Select Form"
              disabled={selectedForm && id ? true : false}
            />
          </div>
        </OnboardingStep>
      )}

      {selectedForm && (
        <>
          <OnboardingStep title="Send a submission" description="Test your form by sending a submission.">
            <CodeSwitcher formId={selectedForm.id} />
          </OnboardingStep>

          <OnboardingStep
            title="Monitor your submissions"
            description="Track form submissions with logs, email notifications, webhooks, & more."
          >
            <Button variant="action" size="sm" onClick={() => router.push(`/forms/${selectedForm.id}`)}>
              <RocketIcon />
              <span className="text-xs font-bold">Get Started</span>
            </Button>
          </OnboardingStep>
        </>
      )}
    </div>
  );
}
