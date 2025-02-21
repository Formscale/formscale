import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3.5">
      <Image src="/assets/logos/formhook-icon.svg" alt="FormHook" width={16} height={16} />
      <span className="font-bold text-xl tracking-tighter">FormHook</span>
    </Link>
  );
}
