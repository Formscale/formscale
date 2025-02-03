import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4">
      <Image src="/logos/formhook-icon.svg" alt="FormHook" width={16} height={16} />
      <span className="font-bold text-xl tracking-tighter">FormHook</span>
    </Link>
  );
}
