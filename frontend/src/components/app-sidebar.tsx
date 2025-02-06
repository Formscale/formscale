"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  StackIcon,
  BarChartIcon,
  ClockIcon,
  GearIcon,
  GlobeIcon,
  ArrowTopRightIcon,
  PersonIcon,
  DotsHorizontalIcon,
  LinkNone2Icon,
  CircleIcon,
  ExitIcon,
} from "@radix-ui/react-icons";

import Logo from "@/components/logo";
import FormButton from "@/components/form-button";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import DefaultDropdown from "@/components/default-dropdown";

const items = [
  {
    title: "Forms",
    url: "/forms",
    icon: StackIcon,
  },
  {
    title: "Metrics",
    url: "/metrics",
    icon: BarChartIcon,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: ClockIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: ArrowTopRightIcon,
  },
  {
    title: "Domains",
    url: "/domains",
    icon: GlobeIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: GearIcon,
  },
];

const footerItems = [
  {
    title: "Onboarding",
    url: "/onboarding",
    icon: LinkNone2Icon,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: CircleIcon,
  },
  {
    title: "Sign out",
    url: "/signout",
    icon: ExitIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="p-3 px-4 mt-1">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-2">
                <FormButton />
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.includes(item.url.replace("/", ""))}>
                    <Link href={item.url}>
                      <item.icon />
                      <span className="text-xs">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DefaultDropdown items={footerItems} side="top" className="w-[--radix-popper-anchor-width]">
              <SidebarMenuButton>
                <PersonIcon />
                <span className="text-xs text-foreground">Dris Elamri</span>
                <DotsHorizontalIcon className="ml-auto" />
              </SidebarMenuButton>
            </DefaultDropdown>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
