import CodeSwitcher from "@/components/code-switcher";
import Bento from "@/components/home/bento";
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
      <div className="flex flex-col items-center justify-center w-full pt-32 md:pt-48 pb-20 gap-4 text-center relative z-10 px-8 overflow-hidden">
        {/* <Image
          src="/assets/logos/formscale-icon.svg"
          alt="Formscale logo"
          className="aspect-square absolute top-0 -right-32 opacity-50 -rotate-12"
          width={500}
          height={500}
        /> */}

        <Badge variant="outline" className="rounded-full mb-2 bg-background">
          <Link href="/" className="flex justify-center items-center gap-2 p-1 hover:underline">
            <div className="w-2 h-2 rounded-full shadow-sm bg-formhook animate-pulse" />
            <span className="text-xs font-normal text-foreground/80">Formscale Beta Live!</span>
          </Link>
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight">
          A Better Way <br /> To Build Forms.
        </h1>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          With Formscale, create & manage scalable forms
          <br className="hidden md:block" />
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

        <div className="flex flex-col gap-4 items-center mt-8 md:mt-12">
          <span className="text-xs text-muted-foreground/80">Tested by top engineering teams at</span>
          <div className="flex flex-wrap md:flex-nowrap w-full justify-center md:justify-between gap-8 cursor-pointer">
            {logos.map((logo, index) => (
              <Image
                key={index}
                src={logo}
                alt="Logo"
                width={120}
                height={100}
                // fix height on mobile
                className={`${index > logos.length - 3 ? "hidden sm:block" : ""} md:w-full md:h-10 h-8 w-auto`}
              />
            ))}
          </div>
        </div>

        <div className="bg-formhook/60 shadow-sm rounded-2xl overflow-hidden p-2 mt-4 cursor-pointer relative">
          {/* replace with video */}
          <div className="w-full max-w-[1280px] mx-auto min-w-[960px] ">
            <Image
              draggable={false}
              src="/assets/images/formscale-dashboard.png"
              alt="Formscale dashboard"
              width={1280}
              height={720}
              className="rounded-lg w-full h-auto"
              priority
            />
          </div>
          {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background/80" /> */}
        </div>

        <span className="text-xs text-muted-foreground/80 mt-4">
          Fully{" "}
          <Link href="https://github.com/formscale" target="_blank" className="underline">
            Open Source
          </Link>{" "}
          - Self-Host For Free!
        </span>

        <div className="flex flex-col gap-4 items-center mt-24 scroll-mt-24" id="features">
          {/* <h2 className="text-3xl md:text-4xl font-bold leading-tight md:leading-tight">
            The <span className="bg-formhook/60 rounded-lg px-2 py-1">Most Powerful</span>
            <br className="hidden md:block" /> Form Builder & Management Tool.
          </h2> */}
          <h2 className="text-3xl md:text-4xl font-bold leading-tight md:leading-tight">
            Build Forms Faster <br className="hidden md:block" />
            Than Pressing Submit.
          </h2>
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
            Formscale seamlessly connects forms to your existing tools, so you can focus on shipping products faster.
          </p>
        </div>

        <div className="text-left overflow-hidden w-full max-w-7xl mt-6 relative">
          <Bento />
          {/* <DotPattern
            width={16}
            height={16}
            className={cn("opacity-60", "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]")}
          /> */}
        </div>

        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 mt-24 relative">
          <div className="flex flex-col gap-4 items-start text-left w-full max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight md:leading-tight">
              Production-Ready <br className="hidden md:block" />
              in &lt;5 Minutes.
            </h2>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Start from concept to live form in under 5 minutes
              <br className="hidden md:block" /> with minimal code - zero backend work needed.
            </p>
          </div>

          <div className="flex w-full max-w-3xl text-left">
            <CodeSwitcher demo />
          </div>

          {/* <DotPattern
            width={16}
            height={16}
            className={cn("opacity-60", "[mask-image:radial-gradient(800px_circle_at_right,white,transparent)]")}
          /> */}
        </div>

        {/* <div className="flex flex-col gap-4 items-center mt-24">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight md:leading-tight">
            Join Teams Saving
            <br className="hidden md:block" /> <span className="bg-formhook/60 rounded-lg px-2 py-1">$$$ & Time</span>{" "}
            with Formscale.
          </h2>
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
            Formscale handles all the heavy lifting of form building, saving you thousands of dollars and development
            hours.
          </p>
        </div> */}
        {/*
        <div className="w-full max-w-7xl flex items-center justify-between gap-12 mt-24">
          <div className="flex w-full max-w-2xl text-left">
            <Testimonials />
          </div>

          <div className="flex flex-col gap-4 items-start text-left w-full max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight md:leading-tight">
              Join Teams Saving
              <br className="hidden md:block" /> <span className="bg-formhook/60 rounded-lg px-2 py-1">$$$ & Time</span>{" "}
              with Formscale.
            </h2>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Formscale handles all the heavy lifting of form building, saving you thousands of dollars and development
              hours.
            </p>
          </div>
        </div> */}

        {/* <div className="bg-formhook/60 text-left shadow-sm rounded-2xl overflow-hidden p-3 w-full max-w-7xl mt-12 cursor-pointer">
          <Bento />
        </div> */}
      </div>
      <DotPattern
        width={16}
        height={16}
        className={cn("opacity-60", "[mask-image:radial-gradient(800px_circle_at_top,white,transparent)]")}
      />
    </>
  );
}
