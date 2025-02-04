import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export function DashCardSkeleton({ children }: { children?: React.ReactNode }) {
  return <Card className="w-full flex flex-col min-h-[300px] justify-center items-center shadow-sm">{children}</Card>;
}

export default function DashCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <DashCardSkeleton>
      <CardHeader>
        <CardTitle className="text-lg text-center font-bold">{title}</CardTitle>
        <CardDescription className="text-xs text-center text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </DashCardSkeleton>
  );
}
