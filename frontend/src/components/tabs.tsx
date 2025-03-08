"use client";

import { Button } from "@formscale/ui/components";
import { usePathname, useRouter } from "next/navigation";

interface TabProps {
  title: string;
  onClickAction: () => void;
  isActive: boolean;
}

interface TabsProps {
  tabs: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  basePath?: string;
}

export function Tab({ title, onClickAction, isActive, ...props }: TabProps) {
  return (
    <Button variant="ghost" size="sm" {...props} className={isActive ? "bg-accent" : ""} onClick={onClickAction}>
      {title}
    </Button>
  );
}

export default function Tabs({ tabs, basePath }: TabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    return pathname === href || (href !== basePath && pathname.startsWith(href));
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {tabs.map((tab) => (
        <Tab key={tab.title} {...tab} isActive={isActive(tab.href)} onClickAction={() => router.push(tab.href)} />
      ))}
    </div>
  );
}
