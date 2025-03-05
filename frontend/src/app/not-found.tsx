import Footer from "@/components/footer";
import { Header } from "@/components/header";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { TriangleLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen gap-2 relative">
        <Loading size="large" />

        <h2 className="text-2xl font-bold mt-6">404 - Not Found</h2>
        <p className="text-sm text-muted-foreground">The page you're looking for was removed or doesn't exist.</p>
        <Button variant="default" className="text-xs font-bold mt-4" asChild>
          <Link href="/">
            <TriangleLeftIcon />
            Go Home
          </Link>
        </Button>

        {/* <DotPattern
          width={16}
          height={16}
          className={cn("opacity-60", "[mask-image:radial-gradient(1000px_circle_at_top,white,transparent)]")}
        /> */}
      </main>
      <Footer />
    </>
  );
}
