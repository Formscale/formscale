import CodeSwitcher from "@/components/code-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { TriangleRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

const basePath = "/assets/images/logos/";
const logos = [
  `${basePath}disney.svg`,
  `${basePath}dropbox.svg`,
  `${basePath}spotify.svg`,
  `${basePath}slack.svg`,
  `${basePath}shopify.svg`,
];

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full pt-48 pb-24 gap-4 text-center relative z-10 px-8">
        {/* <Image
          src="/assets/logos/formscale-icon.svg"
          alt="Formscale logo"
          className="aspect-square absolute top-0 -right-32 opacity-50 -rotate-12"
          width={500}
          height={500}
        /> */}
        <Badge variant="outline" className="rounded-full mb-4 bg-background">
          <Link href="/" className="flex justify-center items-center gap-2 p-1 hover:underline">
            <div className="w-2 h-2 rounded-full shadow-sm bg-formhook animate-pulse" />
            <span className="text-xs font-normal text-foreground/80">Formscale Beta Live!</span>
          </Link>
        </Badge>
        <h1 className="text-6xl font-bold leading-tight">
          A Better Way To <br />
          Build Online Forms.
        </h1>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          With Formscale, create & manage scalable forms
          <br />
          in minutes - not days - from static sites to full-stack-apps.
        </p>

        <div className="flex justify-center gap-4 mt-3">
          <Button variant="action" className="font-bold text-foreground/80 hover:text-foreground group" size="lg">
            {/* Get Started for Free */}
            Join the Waitlist
            <TriangleRightIcon className="-mr-1 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Button>
          {/* <Button variant="outline" className="font-bold text-muted-foreground" size="lg">
            Browse Docs
          </Button> */}
        </div>

        <div className="flex flex-col gap-4 items-center mt-10">
          <span className="text-xs text-muted-foreground/80">Tested by top engineering teams at</span>
          <div className="flex justify-between gap-8 cursor-pointer">
            {logos.map((logo) => (
              <Image src={logo} alt="Logo" width={120} height={100} />
            ))}
          </div>
        </div>

        <div className="bg-formhook/60 shadow-sm rounded-2xl overflow-hidden p-2 mt-6 cursor-pointer">
          {/* replace with video */}
          <Image
            src="/assets/images/formscale-dashboard.png"
            alt="Formscale dashboard"
            width={1280}
            height={720}
            className="rounded-lg"
          />
        </div>

        <span className="text-xs text-muted-foreground/80 mt-4">Fully Open Source - Self-Host For Free!</span>

        <div className="flex flex-col gap-4 items-center mt-16">
          <h2 className="text-4xl font-bold leading-tight">
            The Most Powerful
            <br /> Form Builder & Management Tool.
          </h2>
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
            Formscale seamlessly connects forms to your existing tools and workflows, so you can focus on building
            better products.
          </p>
        </div>

        <div className="w-full flex max-w-4xl mx-auto text-left mt-6">
          <CodeSwitcher demo />
        </div>
      </div>
      <DotPattern
        width={16}
        height={16}
        className={cn("opacity-60", "[mask-image:radial-gradient(800px_circle_at_top,white,transparent)]")}
      />
    </>
  );
}
