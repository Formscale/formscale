import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/assets/logos/formscale-icon.svg"
        alt="Formscale"
        width={38}
        height={38}
        className="-ml-1 aspect-square hover:animate-logo-pulse"
        priority
      />
      <span className="font-bold text-xl text-foreground tracking-tighter">Formscale</span>
    </Link>
  );
}
