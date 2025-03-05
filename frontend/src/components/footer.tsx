import { cn } from "@/lib/utils";
import { uppercase } from "@formscale/utils";
import Image from "next/image";
import Link from "next/link";
import { DotPattern } from "./ui/dot-pattern";

const links = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Components", href: "/components" },
  ],
  company: [
    { label: "About", href: "/about" },
    // { label: "Team", href: "/team" },
    // { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Docs", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "GitHub", href: "/github" },
    { label: "Discord", href: "/discord" },
  ],
  social: [
    { label: "LinkedIn", href: "/linkedin" },
    { label: "Instagram", href: "/instagram" },
    { label: "YouTube", href: "/youtube" },
  ],
};

export default function Footer() {
  return (
    <>
      <div className="z-10 w-full overflow-hidden py-8 px-8 pb-10 relative">
        <div className="flex flex-col md:flex-row gap-12 items-start justify-between max-w-6xl mx-auto pb-14 border-b border-border">
          <div className="flex flex-col items-start w-full gap-6">
            <Image
              src="/assets/logos/formscale-icon.svg"
              alt="Formscale logo"
              className="aspect-square -ml-1 cursor-pointer hover:animate-logo-pulse"
              width={60}
              height={60}
            />

            {/* add email list sign up */}
            {/* <span className="text-sm text-muted-foreground">A better way to build forms.</span> */}
          </div>

          <div className="flex w-full flex-wrap md:flex-nowrap flex-row items-start gap-10 md:gap-12">
            {Object.keys(links).map((key) => (
              <div key={key} className="flex flex-col items-start md:w-full gap-4">
                <p className="text-sm font-bold text-foreground">{uppercase(key)}</p>

                {links[key as keyof typeof links].map((link) => (
                  <Link key={link.label} href={link.href} className="text-xs text-muted-foreground hover:underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 max-w-6xl mx-auto pt-6">
          <span className="text-xs text-muted-foreground/80">© 2025 Formscale, All rights reserved.</span>

          <div className="flex flex-row items-center gap-3 text-xs text-muted-foreground underline">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      <DotPattern
        width={16}
        height={16}
        className={cn("opacity-60", "[mask-image:radial-gradient(800px_circle_at_bottom_left,white,transparent)]")}
      />
    </>
  );
}
