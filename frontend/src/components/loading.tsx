// import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading({ size = "normal" }: { size?: "mini" | "normal" | "large" }) {
  return (
    <div className={`flex w-full flex-col items-center justify-center gap-6 ${size === "large" ? "" : "min-h-[50vh]"}`}>
      <Image
        src="/assets/logos/formscale-icon.svg"
        alt="Formscale loader"
        className={`animate-logo-pulse w-${size === "mini" ? "12" : size === "normal" ? "22" : "48"} aspect-square h-auto drop-shadow-sm cursor-pointer`}
        width={100}
        height={100}
      />
      {/* <Loader2 className="h-12 w-12 text-formscale animate-spin shadow-sm" /> */}
    </div>
  );
}
