import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FeedbackForm } from "./contact";
import { DevSwitcher } from "./dev-switcher";
import { HeaderDashButtons } from "./header-buttons";
import Logo from "./logo";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Formscale/formscale", icon: FaGithub },
  { label: "Discord", href: "https://discord.gg/wwSujZF69Y", icon: FaDiscord },
];

const dashboardLinks = [
  // { label: "Components", href: "/components" },
  { label: "Docs", href: "/docs" },
];

function SocialLinks() {
  return (
    <>
      {socialLinks.map((link, index) => (
        <Button variant="ghost" size="icon" key={link.href} className={`${index === 1 ? "-ml-1.5" : ""}`}>
          <Link href={link.href} target="_blank">
            <link.icon />
          </Link>
        </Button>
      ))}
    </>
  );
}

export function HeaderDashboard() {
  return (
    <div className="z-40 w-full bg-background overflow-hidden p-3 px-4 border-b-[0.5px] border-border">
      <div className="flex flex-row items-center justify-between mx-auto">
        <div className="flex flex-row items-center justify-center gap-3">
          <SidebarTrigger />
          <DevSwitcher />
        </div>
        <div className="flex flex-row items-center gap-2">
          <FeedbackForm>
            <Button variant={"outline"} size="sm" className={"text-muted-foreground"}>
              Feedback
            </Button>
          </FeedbackForm>

          {dashboardLinks.map((link) => (
            <Button variant="ghost" size="sm" className={"text-muted-foreground"} key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}

          <div className="w-px h-6 bg-border ml-2 hidden sm:flex" />
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <div className="z-40 fixed top-0 left-0 w-full bg-background overflow-hidden p-3 px-4 border-b-[0.5px] border-border">
      <div className="flex flex-row items-center justify-between max-w-6xl mx-auto">
        <Logo />

        {/* <div className="md:block hidden absolute left-1/2 -translate-x-1/2">
          <HeaderButtons />
        </div> */}

        <div className="flex flex-row items-center gap-2">
          <HeaderDashButtons />
          <div className="w-px h-6 bg-border ml-2 hidden sm:flex" />
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
