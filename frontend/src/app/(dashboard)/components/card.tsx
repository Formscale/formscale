import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@formscale/ui/components";

export function DashCardSkeleton({ children }: { children?: React.ReactNode }) {
  return <Card className="w-full flex flex-col min-h-[300px] justify-center items-center shadow-sm">{children}</Card>;
}

export function DashCardHeader({ title, description }: { title: string; description: string }) {
  return (
    <CardHeader>
      <CardTitle className="text-lg text-center font-bold">{title}</CardTitle>
      <CardDescription className="text-xs text-center text-muted-foreground">{description}</CardDescription>
    </CardHeader>
  );
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
      <DashCardHeader title={title} description={description} />
      {children && <CardContent>{children}</CardContent>}
    </DashCardSkeleton>
  );
}
