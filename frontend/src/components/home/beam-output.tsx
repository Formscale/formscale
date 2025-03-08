"use client";

import React, { forwardRef, useRef } from "react";

import Loading from "@/components/loading";
import { AnimatedBeam } from "@/components/magic/animated-beam";
import { cn } from "@/lib/utils";
import { PersonIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Circle.displayName = "Circle";

export default function BeamOutput({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn("relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10", className)}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <Icons.user />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <Icons.formscale />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <Icons.gmail />
          </Circle>
          <Circle ref={div2Ref}>
            <Icons.firebase />
          </Circle>
          <Circle ref={div3Ref}>
            <Icons.notion />
          </Circle>
          <Circle ref={div4Ref}>
            <Icons.discord />
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.slack />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div7Ref} duration={3} />
    </div>
  );
}

const basePath = "/assets/images/logos/beams";

const Icons = {
  notion: () => <Image src={`${basePath}/notion.svg`} alt="Notion" width={100} height={100} />,
  formscale: () => <Loading size="mini" />,
  gmail: () => <Image src={`${basePath}/gmail.svg`} alt="Gmail" width={100} height={100} />,
  firebase: () => <Image src={`${basePath}/firebase.svg`} alt="Firebase" width={100} height={100} />,
  zapier: () => <Image src={`${basePath}/zapier.svg`} alt="Zapier" width={100} height={100} />,
  discord: () => <Image src={`${basePath}/discord.svg`} alt="Discord" width={100} height={100} />,
  slack: () => <Image src={`${basePath}/slack.svg`} alt="Slack" width={100} height={100} />,
  kit: () => <Image src={`${basePath}/kit.svg`} alt="ConvertKit" width={100} height={100} />,
  user: () => <PersonIcon className="w-5 h-5" />,
};
