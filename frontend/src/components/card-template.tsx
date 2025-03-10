import { DotPattern } from "@/components/magic/dot-pattern";
import { Card, CardContent } from "@/components/ui/card";
import Watermark from "@/components/watermark";
import { cn } from "@/lib/utils";

export default function CardTemplate({
  Icon,
  iconColor = "text-green-500",
  title,
  description,
  children,
}: {
  Icon: React.ComponentType<{ className: string }>;
  iconColor?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-sm bg-background relative z-10">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Icon className={cn("w-20 h-20", iconColor)} />
          <h2 className="text-2xl font-bold mt-8">{title}</h2>
          <p className="text-xs text-muted-foreground mt-2">{description}</p>

          {children}
        </CardContent>
      </Card>
      <Watermark className="mt-5 z-10" />
      <DotPattern
        width={16}
        height={16}
        className={cn("opacity-60", "[mask-image:radial-gradient(1000px_circle_at_top,white,transparent)]")}
      />
    </>
  );
}
