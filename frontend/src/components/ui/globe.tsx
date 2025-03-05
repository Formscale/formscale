"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [255 / 255, 204 / 255, 14 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
    { location: [44.9778, -93.265], size: 0.07 },
    { location: [51.5074, -0.1278], size: 0.09 },
    { location: [48.8566, 2.3522], size: 0.08 },
    { location: [-33.8688, 151.2093], size: 0.06 },
    { location: [55.7558, 37.6173], size: 0.07 },
    { location: [1.3521, 103.8198], size: 0.05 },
    { location: [-34.6037, -58.3816], size: 0.08 },
    { location: [37.7749, -122.4194], size: 0.09 },
    { location: [35.6762, 139.6503], size: 0.08 },
    { location: [22.3193, 114.1694], size: 0.06 },
    { location: [25.2048, 55.2708], size: 0.07 },
    { location: [52.52, 13.405], size: 0.06 },
    { location: [59.3293, 18.0686], size: 0.04 },
    { location: [-1.2921, 36.8219], size: 0.05 },
  ],
};

// add new point for all submissions ??

export function Globe({ className, config = GLOBE_CONFIG }: { className?: string; config?: COBEOptions }) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005;
        state.phi = phi + rs.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config]);

  return (
    <div className={cn("absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]", className)}>
      <canvas
        className={cn("size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]")}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
