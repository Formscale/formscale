import { OrbitingCircles } from "@/components/magic/orbiting-circles";
import { cn } from "@/lib/utils";
import Image from "next/image";
export default function CircleOrbit({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden", className)}
    >
      <OrbitingCircles iconSize={40}>
        <Icons.html />
        <Icons.javascript />
        <Icons.typescript />
        <Icons.react />
        <Icons.node />
      </OrbitingCircles>
      <OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
        <Icons.nextjs />
        <Icons.vercel />
        <Icons.workers />
      </OrbitingCircles>
    </div>
  );
}

const basePath = "/assets/images/logos/langs";

const Icons = {
  github: () => <Image src={`${basePath}/github.svg`} alt="Github" width={100} height={100} />,
  html: () => <Image src={`${basePath}/html.svg`} alt="HTML" width={100} height={100} />,
  javascript: () => <Image src={`${basePath}/javascript.svg`} alt="Javascript" width={100} height={100} />,
  typescript: () => <Image src={`${basePath}/typescript.svg`} alt="Typescript" width={100} height={100} />,
  node: () => <Image src={`${basePath}/node.svg`} alt="Node" width={100} height={100} />,
  react: () => <Image src={`${basePath}/react.svg`} alt="React" width={100} height={100} />,
  nextjs: () => <Image src={`${basePath}/nextjs.svg`} alt="NextJS" width={100} height={100} />,
  vercel: () => <Image src={`${basePath}/vercel.svg`} alt="Vercel" width={100} height={100} />,
  workers: () => <Image src={`${basePath}/workers.svg`} alt="Workers" width={100} height={100} />,
};
