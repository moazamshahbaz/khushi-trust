import Link from "next/link";
import {
  ArrowRight, Construction, Droplets, GraduationCap, HandHeart, HeartHandshake, HeartPulse,
  Scissors, ShoppingBasket, Siren, TreePine, Trophy, Wallet, type LucideIcon,
} from "lucide-react";
import { href, type Locale } from "@/lib/i18n";
import { IMG, isPortrait, type Program } from "@/lib/content";
import type { ReactNode } from "react";
import { StarGlyph, StarLattice } from "./ornament";
import { ArchImage, HeroImage, Reveal, Rosette } from "./motion";

export const ICONS: Record<string, LucideIcon> = {
  GraduationCap, Scissors, HeartPulse, Droplets, Trophy, TreePine, HandHeart, HeartHandshake,
  Construction, ShoppingBasket, Wallet, Siren,
};

/**
 * Inner-page hero in the home page's manner: full-bleed photo that settles and drifts,
 * indigo wash from the reading side, headline start-aligned, slow rosette on the far side.
 * `portrait` stands a whole portrait in an arch on the far side instead of the rosette.
 */
export function PageHero({ eyebrow, title, subtitle, image, portrait, portraitAlt = "", children }: {
  eyebrow?: string; title: string; subtitle?: string; image?: string;
  portrait?: string; portraitAlt?: string; children?: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-kashi-950 pt-36 pb-20 text-ivory sm:min-h-[78svh] sm:pb-24">
      {image && <HeroImage src={image} alt="" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-kashi-950 via-kashi-950/75 to-kashi-950/35 sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l sm:from-kashi-950/95 sm:via-kashi-950/80 sm:to-kashi-950/25" />
      {!portrait && (
        <Rosette className="pointer-events-none absolute -end-48 top-1/2 -z-10 hidden h-[40rem] w-[40rem] -translate-y-1/2 text-ivory/15 lg:block" />
      )}
      <div className={`mx-auto grid w-full max-w-7xl items-end gap-12 px-4 sm:px-6 ${portrait ? "lg:grid-cols-[7fr_4fr]" : ""}`}>
        <div className="max-w-3xl">
          {eyebrow && <Reveal><p className="tracking-label text-clay">{eyebrow}</p></Reveal>}
          <Reveal delay={0.1}>
            <h1 className="font-display mt-4 text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">{title}</h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-2xl text-lg text-ivory/85 sm:text-xl">{subtitle}</p>
            </Reveal>
          )}
          {children && <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-4">{children}</Reveal>}
        </div>
        {portrait && (
          <Reveal delay={0.2} className="relative mx-auto hidden w-full max-w-xs lg:block">
            <div className="absolute -inset-4 rounded-t-full border border-clay/40" />
            <ArchImage src={portrait} alt={portraitAlt} className="aspect-[4/5] w-full shadow-2xl" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** Star-bulleted list, the site's one list style */
export function StarList({ items, className = "", light = false }: { items: string[]; className?: string; light?: boolean }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((b, j) => (
        <Reveal as="li" key={j} delay={j * 0.04} className="flex gap-3">
          <StarGlyph filled className={`star-bullet h-3 w-3 shrink-0 ${light ? "text-clay" : "text-brick"}`} />
          <span className={light ? "text-ivory/85" : "text-ink/85"}>{b}</span>
        </Reveal>
      ))}
    </ul>
  );
}

/** Body paragraphs, bullets and items of a content section, in the pack's renderOrder when it has one */
export function sectionParts(s: { body?: string[]; bullets?: string[]; items?: unknown[]; renderOrder?: string[] }) {
  const order = s.renderOrder ?? [...(s.body ?? []).map((_, i) => `body.${i}`), "bullets", "items"];
  const used = new Set(order);
  (s.body ?? []).forEach((_, i) => !used.has(`body.${i}`) && order.push(`body.${i}`));
  return order;
}

/** Keep digit runs such as 2026–27 or 10,000 left-to-right inside Urdu and Arabic text */
export function ltr(text?: string | null): ReactNode {
  if (!text) return text;
  const parts = text.split(/(\d[\d,.]*(?:\s?[–-]\s?\d[\d,.]*)?)/);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 ? <bdi key={i} dir="ltr">{p}</bdi> : p));
}

export function SectionTitle({ eyebrow, title, subtitle, light = false, center = true }: {
  eyebrow?: string; title: string; subtitle?: string; light?: boolean; center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`tracking-label ${light ? "text-clay" : "text-brick"}`}>{eyebrow}</p>}
      <h2 className={`font-display mt-3 text-3xl leading-tight sm:text-5xl ${light ? "text-ivory" : "text-kashi-950"}`}>{ltr(title)}</h2>
      {subtitle && <p className={`mt-6 text-lg ${light ? "text-ivory/75" : "text-muted"}`}>{ltr(subtitle)}</p>}
    </Reveal>
  );
}

export function ProgramCard({ p, lang, more, i = 0 }: { p: Program; lang: Locale; more: string; i?: number }) {
  const Icon = ICONS[p.icon] ?? HandHeart;
  return (
    <Reveal delay={(i % 3) * 0.08} className="h-full">
      <Link
        href={href(lang, `/programs/${p.slug}`)}
        className="group flex h-full flex-col rounded-t-[999px] rounded-b-2xl bg-ivory p-3 ring-1 ring-mortar transition-all duration-700 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(17,26,41,.45)] hover:ring-brick/60"
      >
        <div className="arch relative aspect-[4/5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG.program(p.slug)} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-kashi-950/70 via-transparent to-transparent" />
          <span className="absolute bottom-4 start-4 grid h-11 w-11 place-items-center rounded-full bg-ivory/95 text-kashi-800 ring-1 ring-brick/50">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
          <h3 className="font-display text-2xl text-kashi-950">{p.title}</h3>
          <p className="mt-2 flex-1 text-muted">{p.summary}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-kashi-700">
            {more} <ArrowRight className="flip-rtl h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/** Article thumbnail: photos fill the frame; a portrait stands whole in an arch on an indigo ground */
export function ArticleThumb({ src, className = "" }: { src: string; className?: string }) {
  if (src === "composite:intro") {
    // "The Trust at work": three of the Trust's own photos in arches, the ambulance at the centre
    const arches = [
      { img: IMG.school, h: "w-[25%]", pos: "object-center", delay: "delay-0" },
      { img: IMG.ambulance, h: "w-[31%]", pos: "object-[55%_60%]", delay: "delay-75" },
      { img: IMG.program("sports"), h: "w-[25%]", pos: "object-center", delay: "delay-150" },
    ];
    return (
      <div className={`relative overflow-hidden bg-kashi-900 ${className}`}>
        <StarLattice id="thumb-lattice" stroke="#e0a084" opacity={0.08} size={64} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-kashi-950/70 to-transparent" />
        <div className="absolute start-5 top-5 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ivory ring-2 ring-clay/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.logo} alt="" className="h-9 w-9" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-[3.5%]">
          {arches.map((a) => (
            <div
              key={a.img}
              className={`arch relative aspect-[3/4] ${a.h} bg-kashi-800 shadow-[0_-10px_40px_-10px_rgba(0,0,0,.5)] transition-transform duration-700 ${a.delay} group-hover:-translate-y-2`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.img} alt="" loading="lazy" className={`h-full w-full object-cover ${a.pos}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (isPortrait(src))
    return (
      <div className={`relative flex items-end justify-center overflow-hidden bg-kashi-900 ${className}`}>
        <StarLattice id="thumb-lattice" stroke="#e0a084" opacity={0.08} size={64} />
        <div className="arch relative aspect-[4/5] h-[88%] bg-kashi-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-[50%_20%] transition-transform duration-[1600ms] group-hover:scale-105" />
        </div>
      </div>
    );
  return (
    <div className={`overflow-hidden bg-kashi-950 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105" />
    </div>
  );
}

export type Section = {
  id?: string; heading?: string; body?: string[]; bullets?: string[]; image?: string | null;
  items?: { title?: string; text?: string; phone?: string; programSlug?: string }[];
  table?: { columns?: string[]; rows?: (string | number)[][] };
  renderOrder?: string[];
};

/** A section's paragraphs, bullets and item cards, in the pack's order */
export function SectionText({ s, lang, light = false }: { s: Section; lang: Locale; light?: boolean }) {
  return (
    <>
      {sectionParts(s).map((part) => {
        if (part.startsWith("body.")) {
          const b = s.body?.[Number(part.slice(5))];
          return b ? <Reveal key={part} delay={0.05}><p className={`mt-5 text-lg ${light ? "text-ivory/85" : "text-ink/85"}`}>{b}</p></Reveal> : null;
        }
        if (part === "bullets" && s.bullets?.length) return <StarList key={part} items={s.bullets} className="mt-6" light={light} />;
        if (part === "items") return <SectionItems key={part} items={s.items} lang={lang} />;
        return null;
      })}
    </>
  );
}

/** Generic content section: heading, paragraphs, bullets, item cards, table, optional arched photo */
export function Sections({ sections, lang }: { sections: Section[]; lang: Locale }) {
  return (
    <div className="mx-auto max-w-6xl space-y-24 px-4 py-24 sm:px-6">
      {sections.map((s, i) => {
        const img = s.image ? IMG.file(s.image) : undefined;
        return (
          <section key={s.id ?? i} id={s.id} className={`grid items-start gap-12 ${img ? "lg:grid-cols-[5fr_7fr]" : ""}`}>
            {img && (
              <Reveal className={i % 2 ? "lg:order-2" : ""}>
                <ArchImage src={img} alt={s.heading ?? ""} className="mx-auto aspect-[4/5] w-full max-w-md" />
              </Reveal>
            )}
            <div className={img ? "" : "mx-auto max-w-3xl"}>
              {s.heading && (
                <Reveal>
                  <h2 className="font-display mt-4 text-3xl text-kashi-950 sm:text-4xl">{s.heading}</h2>
                </Reveal>
              )}
              <SectionText s={s} lang={lang} />
              {s.table?.rows && (
                <Reveal className="mt-8 overflow-hidden rounded-2xl ring-1 ring-mortar">
                  <table className="w-full text-start">
                    {s.table.columns && (
                      <thead className="bg-kashi-900 text-ivory">
                        <tr>{s.table.columns.map((c) => <th key={c} className="px-5 py-3 text-start font-semibold">{c}</th>)}</tr>
                      </thead>
                    )}
                    <tbody>
                      {s.table.rows.map((r, j) => (
                        <tr key={j} className="odd:bg-plaster/60">
                          {r.map((c, k) => <td key={k} className="px-5 py-3">{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Reveal>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

type Item = { title?: string; text?: string; phone?: string; programSlug?: string };

/** Small cards for a section's items; linked to the programme when they name one */
export function SectionItems({ items, lang }: { items?: Item[]; lang: Locale }) {
  if (!items?.length) return null;
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((it, j) => {
        const inner = (
          <>
            {it.title && <h3 className="font-display text-xl text-kashi-900">{it.title}</h3>}
            {it.text && <p className="mt-1.5 text-muted">{it.text}</p>}
            {it.phone && <a href={`tel:${it.phone.replace(/\s/g, "")}`} className="mt-2 block font-semibold text-kashi-700"><bdi dir="ltr">{it.phone}</bdi></a>}
          </>
        );
        return (
          <Reveal key={j} delay={(j % 4) * 0.06}>
            {it.programSlug ? (
              <Link href={href(lang, `/programs/${it.programSlug}`)} className="block h-full rounded-2xl bg-plaster/70 p-5 ring-1 ring-mortar transition-colors hover:ring-brick/60">{inner}</Link>
            ) : (
              <div className="h-full rounded-2xl bg-plaster/70 p-5 ring-1 ring-mortar">{inner}</div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

/** Small programme card with an arched thumbnail: used where a figure or target belongs to a programme */
export function ProgramLine({ lang, slug, title, text, cta, dark = false }: {
  lang: Locale; slug: string; title?: string; text?: string; cta?: string; dark?: boolean;
}) {
  return (
    <Link
      href={href(lang, `/programs/${slug}`)}
      className={`group flex h-full gap-5 rounded-2xl p-4 transition-colors ${dark ? "bg-kashi-900/70 ring-1 ring-brick/25 hover:ring-clay/60" : "bg-ivory ring-1 ring-mortar hover:ring-brick/60"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMG.program(slug)} alt="" loading="lazy" className="arch h-24 w-20 shrink-0 object-cover transition-transform duration-700 group-hover:-translate-y-1" />
      <div className="min-w-0 self-center">
        <h3 className={`font-display text-xl ${dark ? "text-clay" : "text-kashi-950"}`}>{ltr(title)}</h3>
        <p className={`mt-1 text-sm ${dark ? "text-ivory/80" : "text-muted"}`}>{ltr(text)}</p>
        {cta && <span className={`mt-2 inline-block text-sm font-semibold ${dark ? "text-ivory" : "text-kashi-700"}`}>{cta}</span>}
      </div>
    </Link>
  );
}

/** Emerald call-to-action band */
export function DonateBand({ lang, title, body, donate, volunteer }: { lang: Locale; title: string; body: string; donate: string; volunteer: string }) {
  return (
    <section className="relative isolate overflow-hidden border-t border-mortar bg-plaster py-24">
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal><h2 className="font-display text-3xl text-kashi-950 sm:text-5xl">{title}</h2></Reveal>
        <Reveal delay={0.1}><p className="mt-5 text-lg text-muted">{body}</p></Reveal>
        <Reveal delay={0.2} className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href={href(lang, "/donate")} className="rounded-full bg-brick px-8 py-3.5 font-semibold text-ivory transition-colors hover:bg-brick-deep">{donate}</Link>
          <Link href={href(lang, "/volunteer")} className="rounded-full px-8 py-3.5 font-semibold text-kashi-900 ring-1 ring-kashi-900/40 transition-colors hover:bg-kashi-900 hover:text-ivory">{volunteer}</Link>
        </Reveal>
      </div>
    </section>
  );
}
