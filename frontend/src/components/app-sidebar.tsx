"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowTopRightIcon,
  AvatarIcon,
  BarChartIcon,
  CircleIcon,
  ClockIcon,
  DotsHorizontalIcon,
  ExitIcon,
  GearIcon,
  GlobeIcon,
  LinkNone2Icon,
  StackIcon,
} from "@radix-ui/react-icons";

import FormButton from "@/components/form-button";
import Logo from "@/components/logo";
import { useAuth } from "@/providers/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import DefaultDropdown from "@/components/default-dropdown";
import { useUser } from "@/providers/user";
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

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useUser();

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
      onClick: () => {
        logout();
      },
      icon: ExitIcon,
    },
  ];

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="p-3 px-4 mt-1">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              <SidebarMenuItem className="mb-2">
                <FormButton />
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.split("/")[1] === item.url.split("/")[1]}>
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
                <AvatarIcon />
                <span className="text-xs text-foreground">{user?.name}</span>
                <DotsHorizontalIcon className="ml-auto" />
              </SidebarMenuButton>
            </DefaultDropdown>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
