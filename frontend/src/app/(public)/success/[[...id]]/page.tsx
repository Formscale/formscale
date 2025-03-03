import { Card, CardContent } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";
import Watermark from "@/components/watermark";
import { cn } from "@/lib/utils";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import SuccessButton from "./button";

export default async function SuccessPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  console.log(id);

  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-sm bg-background relative z-10">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          {/* <Image
            src="/assets/logos/formscale-icon.svg"
            alt="Formscale"
            width={110}
            height={110}
            className="aspect-square hover:animate-logo-pulse cursor-pointer"
            priority
          /> */}
          <CheckCircledIcon className="w-20 h-20 text-green-500" />
          <h2 className="text-2xl font-bold mt-8">Submission received!</h2>
          <p className="text-xs text-muted-foreground mt-2">Your form has been submitted.</p>

          <SuccessButton id={id} />
        </CardContent>
      </Card>
      <Watermark className="mt-5 z-10" />
      {/* <DotBackground /> */}
      <DotPattern
        width={16}
        height={16}
        className={cn("opacity-60", "[mask-image:radial-gradient(1000px_circle_at_top,white,transparent)]")}
      />
    </>
  );
}
