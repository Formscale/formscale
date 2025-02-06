import { Badge } from "@/components/ui/badge";

export default function DashBadge({
  variant = "default",
  children,
}: {
  variant?: "default" | "action" | "secondary";
  children: React.ReactNode;
}) {
  return (
    <Badge variant={variant} className="max-w-fit text-xs px-2 flex justify-center items-center gap-2 font-normal">
      {children}
    </Badge>
  );
}
