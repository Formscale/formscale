"use client";

import { useUser } from "@/providers";
import { Button } from "@formscale/ui/components";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderDashButtons() {
  const { user } = useUser();

  return (
    <>
      {!user ? (
        <>
          <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button variant="action" size="sm" className="font-bold hidden sm:flex" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </>
      ) : (
        <Button variant="action" size="sm" className="font-bold hidden sm:flex" asChild>
          <Link href="/forms">Dashboard</Link>
        </Button>
      )}
    </>
  );
}

const links = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Components", href: "/components" },
  // { label: "Docs", href: "/docs" },
];

export function HeaderButtons() {
  const pathname = usePathname();

  return (
    <div className="flex flex-row items-center gap-1">
      {links.map((link) => (
        <Button
          variant="ghost"
          size="sm"
          key={link.href}
          className={pathname.includes(link.href) ? "bg-accent" : ""}
          asChild
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </div>
  );
}
