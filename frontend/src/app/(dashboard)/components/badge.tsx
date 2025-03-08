import { Badge } from "@formscale/ui/components";

export default function DashBadge({
  variant = "default",
  children,
}: {
  variant?: "default" | "action" | "secondary" | "success" | "destructive";
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant={variant}
      className="max-w-fit text-xs px-2 flex justify-center items-center gap-2 font-normal shadow-sm"
    >
      {children}
    </Badge>
  );
}
