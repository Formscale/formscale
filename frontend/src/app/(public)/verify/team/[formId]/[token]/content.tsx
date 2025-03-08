"use client";

import CardTemplate from "@/components/card-template";
import Loading from "@/components/loading";
import { useFetch } from "@/hooks/fetch";
import { Button } from "@formscale/ui/components";
import {
  CheckCircledIcon,
  CheckIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  TriangleLeftIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyTeamContent({ formId, token }: { formId: string; token: string }) {
  const { get, put } = useFetch();
  const [isLoading, setIsLoading] = useState(true);
  const [formName, setFormName] = useState<string | null>(null);
  const [result, setResult] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    async function loadForm() {
      if (!formId || !token) {
        return;
      }

      try {
        const response = await get("verify/form/:id", {
          params: { id: formId },
        });

        if (response.success && response.data?.name) {
          setFormName(response.data.name);
        }
      } catch (err) {
        setFormName(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadForm();
  }, [formId, token]);

  const handleAccept = async () => {
    if (!formId || !token) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await put("verify/team/:token", null, {
        params: { token },
      });

      if (response.success) {
        setResult(
          <CardTemplate
            Icon={CheckCircledIcon}
            iconColor="text-green-500"
            title="Invitation accepted."
            description={"Submissions will now be forwarded to your email."}
          >
            <Button variant="default" className="mt-6" asChild>
              <Link href="/">
                <TriangleLeftIcon />
                <span className="text-xs font-bold">Go Home</span>
              </Link>
            </Button>
          </CardTemplate>
        );
      }
    } catch (err) {
      setResult(
        <CardTemplate
          Icon={CrossCircledIcon}
          iconColor="text-red-500"
          title="Invalid invitation."
          description={(err as Error).message}
        />
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !result) return <Loading />;

  if (result) return result;

  if (!formName) {
    return (
      <CardTemplate
        Icon={CrossCircledIcon}
        iconColor="text-red-500"
        title="Form not found."
        description="Please contact the invitee for a new invitation."
      />
    );
  }

  return (
    <CardTemplate
      Icon={QuestionMarkCircledIcon}
      iconColor={"text-yellow-500"}
      title={`Join "${formName}"?`}
      description={"By accepting, you'll receive form submissions to your email."}
    >
      <Button variant="action" className="mt-6" onClick={async () => await handleAccept()} disabled={isLoading}>
        <CheckIcon />
        <span className="text-xs font-bold">Accept Invitation</span>
      </Button>
    </CardTemplate>
  );
}
