"use client";

import { useFetch } from "@/hooks/fetch";
import { Button } from "@formscale/ui/components";
import { TriangleLeftIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function SuccessButton({ id }: { id?: string }) {
  const { get } = useFetch();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!id) {
      history.back();
      return;
    }

    try {
      setIsLoading(true);
      const response = await get("s/:id/click", {
        params: { id },
      });

      if (response.success) {
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      history.back();
    }
  };

  return (
    <Button variant="action" className="mt-6" onClick={async () => await handleClick()} disabled={isLoading}>
      <TriangleLeftIcon className="w-4 h-4" />
      <span className="text-xs font-bold">Go Back</span>
    </Button>
  );
}
