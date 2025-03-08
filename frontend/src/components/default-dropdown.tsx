import React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@formscale/ui/components";
import Link from "next/link";

/* this code is cooked */

export interface DefaultDropdownItem {
  title: string;
  url?: string;
  onClick?: () => void;
  icon?: React.ComponentType;
  dialog?: React.ReactNode;
}

export interface DefaultDropdownProps {
  items: DefaultDropdownItem[];
  children?: React.ReactNode;
  muted?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

function Wrapper({ children, href, dialog }: { children: React.ReactNode; href: string; dialog?: React.ReactNode }) {
  if (href) {
    return <Link href={href}>{children}</Link>;
  }

  if (dialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {dialog}
      </Dialog>
    );
  }

  return <>{children}</>;
}

export function DropdownItem({ item, muted }: { item: DefaultDropdownItem; muted?: boolean }) {
  return (
    <Wrapper href={item.url ?? ""} dialog={item.dialog}>
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={item.onClick}
        onSelect={item.dialog ? (e) => e.preventDefault() : undefined}
      >
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
