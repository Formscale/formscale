import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* this code is cooked */

export interface DefaultDropdownProps {
  items: {
    title: string;
    url?: string;
    onClick?: () => void;
    icon?: React.ComponentType;
  }[];
  children?: React.ReactNode;
  muted?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

function Wrapper({ children, href }: { children: React.ReactNode; href: string }) {
  if (href) {
    return <Link href={href}>{children}</Link>;
  }
  return <>{children}</>;
}

export function DropdownItem({
  item,
  muted,
}: {
  item: { title: string; url?: string; icon?: React.ComponentType; onClick?: () => void };
  muted?: boolean;
}) {
  return (
    <Wrapper href={item.url ?? ""}>
      <DropdownMenuItem className="cursor-pointer" onClick={item.onClick}>
        {item.icon && <item.icon />}
        <span className={cn("text-xs", muted && "text-muted-foreground")}>{item.title}</span>
      </DropdownMenuItem>
    </Wrapper>
  );
}

export function DropdownSkeleton({
  button,
  children,
  ...props
}: {
  button: React.ReactNode;
  children: React.ReactNode;
  props?: React.ComponentProps<typeof DropdownMenuContent>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DefaultDropdown({ items, children, muted, ...props }: DefaultDropdownProps) {
  return (
    <DropdownSkeleton button={children} {...props}>
      {items.map((item, index) => (
        <DropdownItem item={item} muted={muted} key={index} />
      ))}
    </DropdownSkeleton>
  );
}
