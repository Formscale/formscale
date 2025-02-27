"use client";

import { Button } from "@/components/ui/button";
import { TriangleLeftIcon } from "@radix-ui/react-icons";

// make request to log the user action (see if user is logged in?)

export default function SuccessButton() {
  return (
    <Button variant="action" className="mt-6" onClick={() => history.back()}>
      <TriangleLeftIcon className="w-4 h-4" />
      <span className="text-xs font-bold">Go Back</span>
    </Button>
  );
}
