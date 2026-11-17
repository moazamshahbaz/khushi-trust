import "server-only";
import type en from "@/content/en.json";
import type { Locale } from "./i18n";

export type Dict = typeof en;
export type Program = Dict["programs"][number];
export type Article = Dict["articles"][number];

const loaders: Record<Locale, () => Promise<Dict>> = {
  en: () => import("@/content/en.json").then((m) => m.default as Dict),
  ur: () => import("@/content/ur.json").then((m) => m.default as unknown as Dict),
  ar: () => import("@/content/ar.json").then((m) => m.default as unknown as Dict),
};

export const getDict = (l: Locale) => loaders[l]();

/**
 * Photography. Real Trust photos are kept where they exist; stock images from the old
 * site are replaced by generated scenes of rural Okara (public/images/gen, AI-generated).
 */
const PROGRAM_IMAGES: Record<string, string> = {
  "education-support": "/images/girls-school.jpeg",
  "women-empowerment": "/images/gen/women-empowerment.jpg",
  healthcare: "/images/gen/healthcare.jpg",
  "clean-water": "/images/gen/clean-water.jpg",
  sports: "/images/sports.jpg",
  "tree-plantation": "/images/gen/tree-plantation.jpg",
  "funeral-support": "/images/funeral-support.jpg",
  "easy-marriage": "/images/gen/easy-marriage.jpg",
  infrastructure: "/images/gen/infrastructure.jpg",
  "food-assistance": "/images/gen/food-assistance.jpg",
  "interest-free-loans": "/images/gen/interest-free-loans.jpg",
  "emergency-relief": "/images/gen/emergency-relief.jpg",
};

export const IMG = {
  hero: "/images/gen/hero.jpg",
  mosque: "/images/gen/mosque-dusk.jpg",
  community: "/images/gen/community.jpg",
  school: "/images/girls-school.jpeg",
  founder: "/images/qari-khushi-2.png",
  ambulance: "/images/WhatsApp_Image_2026-03-15_at_9.36.22_PM.jpeg",
  logo: "/images/logo.png",
  program: (slug: string) => PROGRAM_IMAGES[slug] ?? "/images/gen/community.jpg",
  /** content files reference source filenames; map them to served paths */
  file: (name?: string | null) => (name ? `/images/${name}` : undefined),
  /** Article thumbnails: the two biographies must not repeat the same portrait side by side */
  article: (a: { slug: string; image?: string | null }) =>
    a.slug === "qari-khushi-urdu" ? "/images/gen/mosque-dusk.jpg"
    : a.slug === "the-kushi-trust-introduction" ? "composite:intro"
    : a.image ? `/images/${a.image}` : "/images/gen/mosque-dusk.jpg",
};

/** Portraits are framed whole inside an arch instead of being cropped to a landscape card */
export const isPortrait = (src?: string) => !!src && src.includes("qari-khushi");

/** "PKR 6.8M+" -> { prefix: "PKR ", value: 6.8, suffix: "M+" } */
export function parseStat(v: string | number) {
  if (typeof v === "number") return { prefix: "", value: v, suffix: "", decimals: decimalsOf(v) };
  const m = v.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const num = m[2].replace(/,/g, "");
  return {
    prefix: m[1],
    value: parseFloat(num),
    suffix: m[3],
    decimals: num.includes(".") ? num.split(".")[1].length : 0,
  };
}
export const decimalsOf = (v: number) => (String(v).split(".")[1] ?? "").length;

/** Headline figures for the home page, all taken from the programme and impact pages */
export function homeStats(d: Dict) {
  const p = (slug: string) => d.programs.find((x) => x.slug === slug)?.stat;
  const imp = d.pages.impact.stats;
  const out: { prefix: string; value: number; suffix: string; decimals: number; label: string }[] = [];
  const push = (raw: string | number | undefined, label: string | undefined, prefix = "", suffix = "") => {
    if (raw == null || !label) return;
    const s = parseStat(raw);
    if (s) out.push({ ...s, prefix: prefix || s.prefix, suffix: suffix || s.suffix, label });
  };
  push(imp[1]?.value, imp[1]?.label, "", imp[1]?.suffix);
  push(p("food-assistance")?.value, p("food-assistance")?.label);
  push(p("clean-water")?.value, p("clean-water")?.label);
  push(p("tree-plantation")?.value, p("tree-plantation")?.label);
  push(imp[2]?.value, imp[2]?.label, (imp[2] as { prefix?: string })?.prefix, imp[2]?.suffix);
  push(imp[0]?.value, imp[0]?.label);
  return out;
}
