// import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 min-h-[50vh]">
      <Image
        src="/assets/logos/formscale-icon.svg"
        alt="Formscale loader"
        className="animate-logo-pulse w-20 h-auto drop-shadow-sm cursor-pointer"
        width={100}
        height={100}
      />
      {/* <Loader2 className="h-12 w-12 text-formhook animate-spin shadow-sm" /> */}
    </div>
  );
}
