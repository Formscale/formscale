import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

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

export default function Header() {
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
          <Button variant="ghost" size="sm" className="font-bold">
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
