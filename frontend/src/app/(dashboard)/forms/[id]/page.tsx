"use client";

import { Button } from "@/components/ui/button";
import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import { Input } from "@/components/ui/input";

export default function FormPage() {
  const form = { id: "123" };

  return (
    <DataCardSkeleton
      title="Endpoint"
      button={
        <Button
          type="submit"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}/forms/${form.id}`);
          }}
        >
          <span className="text-xs font-bold">Copy Endpoint</span>
        </Button>
      }
    >
      <div className="space-y-2">
        <span className="text-[0.8rem]">Copy the endpoint to use in your form.</span>
        <Input
          type="text"
          placeholder="https://api.formhook.com/123"
          value={`https://api.formhook.com/forms/${form.id}`}
          disabled
          className="max-w-sm"
        />
      </div>
    </DataCardSkeleton>
  );
}
