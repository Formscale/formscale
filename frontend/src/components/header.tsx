import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const links = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Templates", href: "/templates" },
  { label: "Docs", href: "/docs" },
];

const socialLinks = [
  { label: "GitHub", href: "/github", icon: GitHubLogoIcon },
  // { label: "Discord", href: "/discord", icon: DiscordLogoIcon },
];

const dashboardLinks = [
  { label: "Feedback", href: "/feedback" },
  { label: "Templates", href: "/templates" },
  { label: "Docs", href: "/docs" },
];

export function HeaderDashboard() {
  return (
    <div className="w-full bg-background overflow-hidden p-3 px-4 border-b-[0.5px] border-border">
      <div className="flex flex-row items-center justify-between mx-auto">
        <div className="flex flex-row items-center gap-2">
          <SidebarTrigger />
        </div>
        <div className="flex flex-row items-center gap-2">
          {dashboardLinks.map((link, index) => (
            <Button
              variant={index === 0 ? "outline" : "ghost"}
              size="sm"
              className={index === 0 ? "" : "text-muted-foreground"}
              key={link.href}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}

          <div className="w-px h-6 bg-border ml-2" />

          {socialLinks.map((link) => (
            <Button variant="ghost" size="icon" key={link.href}>
              <Link href={link.href}>
                <link.icon className="w-4 h-4" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <div className="z-50 fixed top-0 left-0 w-full bg-background overflow-hidden p-3 px-4 border-b-[0.5px] border-border">
      <div className="flex flex-row items-center justify-between max-w-6xl mx-auto">
        <Logo />

        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="flex flex-row items-center gap-1">
            {links.map((link) => (
              <Button variant="ghost" size="sm" key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Button variant="ghost" size="sm">
            <Link href="/login">Log In</Link>
          </Button>
          <Button variant="action" size="sm" className="font-bold">
            <Link href="/signup">Get Started</Link>
          </Button>
          <div className="w-px h-6 bg-border ml-2" />

          {socialLinks.map((link) => (
            <Button variant="ghost" size="icon" key={link.href}>
              <Link href={link.href}>
                <link.icon className="w-4 h-4" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
