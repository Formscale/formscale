"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface TabsProps {
  tabs: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export default function Tabs({ tabs }: TabsProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
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
