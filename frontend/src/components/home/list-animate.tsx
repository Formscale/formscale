"use client";

import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";

interface Item {
  name: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  time: string;
}

import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowRightCircleIcon,
  BanIcon,
  CheckCircleIcon,
  MailIcon,
  MousePointerClickIcon,
  ShieldAlertIcon,
  ShieldIcon,
} from "lucide-react";

let notifications = [
  {
    name: "200 - Button Clicked on https://example.com",
    description: "User interaction tracked successfully",
    time: "10m ago",
    icon: MousePointerClickIcon,
    color: "text-green-500",
  },
  {
    name: "400 - Duplicate Email",
    description: "User attempted to register with existing email",
    time: "2m ago",
    icon: AlertCircleIcon,
    color: "text-amber-500",
  },
  {
    name: "200 - Submission Created",
    description: "Form data successfully received and stored",
    time: "15m ago",
    icon: CheckCircleIcon,
    color: "text-green-500",
  },
  {
    name: "403 - Form Submitted from Blocked Origin",
    description: "Security rule prevented cross-origin submission",
    time: "2m ago",
    icon: ShieldAlertIcon,
    color: "text-destructive",
  },
  {
    name: "200 - Email Sent",
    description: "Notification delivered to recipient",
    time: "10m ago",
    icon: MailIcon,
    color: "text-blue-500",
  },
  {
    name: "403 - ReCAPTCHA Failed",
    description: "Bot protection triggered by suspicious activity",
    time: "2m ago",
    icon: ShieldIcon,
    color: "text-destructive",
  },
  {
    name: "302 - Redirected to https://example.com",
    description: "User successfully redirected after submission",
    time: "5m ago",
    icon: ArrowRightCircleIcon,
    color: "text-blue-500",
  },
  {
    name: "200 - File Uploaded",
    description: "File successfully uploaded",
    time: "15m ago",
    icon: CheckCircleIcon,
    color: "text-green-500",
  },
  {
    name: "400 - Webhook Failed",
    description: "Integration error: endpoint returned invalid response",
    time: "2m ago",
    icon: AlertTriangleIcon,
    color: "text-amber-500",
  },
  {
    name: "403 - Spam Detected",
    description: "Submission blocked by content filtering rules",
    time: "2m ago",
    icon: BanIcon,
    color: "text-destructive",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon: Icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative min-h-fit mx-auto w-full max-w-[700px] cursor-pointer overflow-hidden rounded-2xl p-4 border border-border",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white shadow-sm",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className={cn("flex size-10 items-center justify-center rounded-2xl", color)}>
          <Icon />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg font-bold">{name}</span>
            <span className="mx-2">·</span>
            <span className="text-xs text-muted-foreground/80">{time}</span>
          </figcaption>
          <p className="text-sm sm:text-md font-normal text-muted-foreground">{description}</p>
        </div>
      </div>
    </figure>
  );
};

export default function ListAnimate({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative flex h-[500px] w-full flex-col overflow-hidden p-2", className)}
      style={{
        transform: "translateZ(0) scale(80%) perspective(1px)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
