import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { TriangleRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2 relative">
      <Loading size="large" />

      <h2 className="text-2xl font-bold mt-6">It&apos;s Free!</h2>
      <p className="text-sm text-muted-foreground">Formscale is currently in beta & adding more features.</p>
      <Button variant="action" className="text-xs font-bold mt-4" asChild>
        <Link href="/signup">
          Get Started
          <TriangleRightIcon />
        </Link>
      </Button>
    </div>
  );
}
