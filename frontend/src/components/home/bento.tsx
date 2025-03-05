import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import { BentoCard, BentoGrid } from "../ui/bento-grid";
import { Globe } from "../ui/globe";
import BeamOutput from "./beam-output";
import CircleOrbit from "./circle-orbit";
import ListAnimate from "./list-animate";

const features = [
  {
    Icon: FileTextIcon,
    name: "Simplified management.",
    description: "Formscale filters all submissions, validating the data you need, while blocking spam & bots.",
    href: "/forms",
    cta: "Get Started",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Globe className="absolute h-[400px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-110" />
    ),
  },
  {
    Icon: BellIcon,
    name: "Monitor form events.",
    description:
      "Formscale logs key events, including interactions, errors, and more, so you can track a user's journey throughout your pages & forms.",
    href: "/forms",
    cta: "Get Started",
    className: "col-span-3 lg:col-span-2",
    background: (
      <ListAnimate className="absolute h-[300px] w-full scale-[85%] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-[90%]" />
    ),
  },
  {
    Icon: Share2Icon,
    name: "Streamline your workflows.",
    description:
      "With 30+ integrations, including built-in email and webhook support, Formscale easily integrates with your existing CRMs, Databases, Applications, and more.",
    href: "/forms",
    cta: "Get Started",
    className: "col-span-3 lg:col-span-2",
    background: (
      <BeamOutput className="absolute top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Developer-centric.",
    description: "Improve user conversions, the developer experience, and reduce downtime with ease.",
    className: "col-span-3 lg:col-span-1",
    href: "/forms",
    cta: "Get Started",
    background: (
      <CircleOrbit className="absolute h-[400px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] group-hover:scale-105" />
    ),
  },
];

export default function Bento() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
