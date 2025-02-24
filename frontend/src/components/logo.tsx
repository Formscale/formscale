import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
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
