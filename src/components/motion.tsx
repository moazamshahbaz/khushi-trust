"use client";

import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { starPoints } from "./ornament";

const calm = [0.22, 1, 0.36, 1] as const;

/** Slow fade-and-rise on entering the viewport */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, ease: calm, delay }}
    >
      {children}
    </M>
  );
}

/** Photo revealed through an arch: the image settles from a slight zoom */
export function ArchImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`arch relative overflow-hidden bg-plaster ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
        initial={reduce ? false : { scale: 1.14, opacity: 0.4 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.8, ease: calm }}
      />
    </div>
  );
}

/** Count up once when visible; renders Western digits for every locale */
export function Counter({ value, prefix = "", suffix = "", decimals = 0, className = "" }: {
  value: number; prefix?: string; suffix?: string; decimals?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2.2, ease: calm, onUpdate: setN });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} dir="ltr" className={`whitespace-nowrap [unicode-bidi:isolate] ${className}`}>
      {prefix && <span className="text-[0.55em]">{prefix}</span>}
      {n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Large 16-fold rosette that draws itself in, then turns very slowly */
export function Rosette({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const rings = [
    { R: 190, r: 150, n: 16, rot: 0 },
    { R: 150, r: 112, n: 8, rot: Math.PI / 8 },
    { R: 150, r: 112, n: 8, rot: 0 },
    { R: 96, r: 72, n: 8, rot: Math.PI / 16 },
    { R: 52, r: 40, n: 8, rot: 0 },
  ];
  return (
    <motion.svg
      viewBox="0 0 400 400"
      aria-hidden
      className={className}
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        {[198, 160, 120].map((rad, i) => (
          <motion.circle
            key={rad}
            cx="200"
            cy="200"
            r={rad}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.4, delay: 0.2 + i * 0.25, ease: calm }}
          />
        ))}
        {rings.map((g, i) => (
          <motion.polygon
            key={i}
            points={starPoints(200, 200, g.R, g.r, g.n, g.rot)}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.6 + i * 0.35, ease: calm }}
          />
        ))}
      </g>
    </motion.svg>
  );
}

/** Full-bleed hero photo: slow settle on load, gentle parallax on scroll */
export function HeroImage({ src, alt }: { src: string; alt: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 160]);
  return (
    <motion.div style={{ y }} className="absolute inset-0 -z-20">
      <motion.img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 9, ease: calm }}
      />
    </motion.div>
  );
}

/** Lenis smooth scrolling; disabled for reduced motion */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.09 });
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [reduce]);
  return null;
}
