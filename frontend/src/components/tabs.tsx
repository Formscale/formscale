"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsProps {
  tabs: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  basePath?: string;
}

export default function Tabs({ tabs, basePath }: TabsProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== basePath && pathname.startsWith(href));
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {tabs.map((tab) => (
        <Button key={tab.title} variant="ghost" size="sm" className={isActive(tab.href) ? "bg-accent" : ""} asChild>
          <Link href={tab.href}>{tab.title}</Link>
        </Button>
      ))}
    </div>
  );
}
