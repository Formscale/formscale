import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Watermark({ className }: { className?: string }) {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://formscale.dev"}`}
      className={cn("flex justify-center items-center gap-2.5 select-none opacity-75", className)}
      target="_blank"
    >
      <span className="text-xs text-foreground">Powered by</span>
      <Image src="/assets/logos/formscale-logo.svg" alt="Formscale logo" width={105} height={30} />
    </Link>
  );
}
