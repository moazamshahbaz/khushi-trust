import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, HandHeart } from "lucide-react";
import { hasLocale, href, locales } from "@/lib/i18n";
import { getDict, IMG, parseStat } from "@/lib/content";
import en from "@/content/en.json";
import { ICONS, SectionTitle, StarList, ltr, type Section } from "@/components/blocks";
import { Counter, HeroImage, Reveal } from "@/components/motion";

export const generateStaticParams = () =>
  locales.flatMap((lang) => en.programs.map((p) => ({ lang, slug: p.slug })));

export async function generateMetadata({ params }: PageProps<"/[lang]/programs/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const p = (await getDict(lang)).programs.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProgramPage({ params }: PageProps<"/[lang]/programs/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const i = d.programs.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = d.programs[i];
  const prev = d.programs[(i - 1 + d.programs.length) % d.programs.length];
  const next = d.programs[(i + 1) % d.programs.length];
  const Icon = ICONS[p.icon] ?? HandHeart;
  const stat = p.stat ? parseStat(p.stat.value) : null;
  // Every programme pack holds three sections in this order: overview, achievements, the year's target
  const [overview, achievements, target] = p.sections as Section[];

  return (
    <>
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden pb-20 text-ivory">
        <HeroImage src={IMG.program(p.slug)} alt={p.title} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-kashi-950 via-kashi-950/55 to-kashi-950/20" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Link href={href(lang, "/programs")} className="inline-flex items-center gap-2 text-sm text-clay">
              <ArrowLeft className="flip-rtl h-4 w-4" /> {d.ui.backToPrograms}
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="mt-6 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-ivory/95 text-kashi-800 ring-1 ring-brick/60"><Icon className="h-6 w-6" /></span>
            <span className="tracking-label text-clay">{String(i + 1).padStart(2, "0")} / 12</span>
          </Reveal>
          <Reveal delay={0.2}><h1 className="font-display mt-5 max-w-3xl text-5xl leading-tight sm:text-7xl">{p.title}</h1></Reveal>
          <Reveal delay={0.3}><p className="mt-5 max-w-2xl text-xl text-ivory/85">{p.summary}</p></Reveal>
        </div>
      </section>

      {stat && p.stat && (
        <section className="border-b border-mortar bg-plaster/70">
          <Reveal className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6">
            <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} className="font-display text-5xl text-kashi-800 sm:text-6xl" />
            <p className="mt-2 text-muted">{p.stat.label}</p>
          </Reveal>
        </section>
      )}

      {/* ---------- Overview and achievements ---------- */}
      <section className="py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-16 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            {overview?.heading && <SectionTitle title={overview.heading} center={false} />}
            {overview?.body?.map((b, j) => (
              <Reveal key={j} delay={0.1}>
                <p className="font-display mt-8 text-2xl leading-snug text-kashi-900 sm:text-3xl">{b}</p>
              </Reveal>
            ))}
            {overview?.bullets?.length ? <StarList items={overview.bullets} className="mt-8" /> : null}
          </div>
          {achievements && (achievements.bullets?.length || achievements.body?.length) ? (
            <Reveal delay={0.1} className="rounded-3xl bg-plaster/80 p-8 ring-1 ring-mortar sm:p-10">
              {achievements.heading && <h2 className="font-display text-3xl text-kashi-950">{achievements.heading}</h2>}
              {achievements.body?.map((b, j) => <p key={j} className="mt-4 text-lg text-ink/85">{b}</p>)}
              {achievements.bullets?.length ? (
                <ol className="mt-8 space-y-6">
                  {achievements.bullets.map((b, j) => (
                    <li key={j} className="flex gap-5 border-t border-mortar pt-6 first:border-0 first:pt-0">
                      <span dir="ltr" className="font-display text-2xl text-brick">{String(j + 1).padStart(2, "0")}</span>
                      <span className="text-lg text-ink/85">{ltr(b)}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ---------- The year's target, and the call to support it ---------- */}
      <section className="relative isolate overflow-hidden bg-kashi-950 py-28 text-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[7fr_5fr]">
          <div>
            {target?.heading && <Reveal><h2 className="font-display text-4xl text-clay sm:text-5xl">{ltr(target.heading)}</h2></Reveal>}
            {target?.body?.map((b, j) => (
              <Reveal key={j} delay={0.1}><p className="font-display mt-6 text-2xl leading-snug text-ivory/90 sm:text-3xl">{b}</p></Reveal>
            ))}
            {target?.bullets?.length ? <StarList items={target.bullets} light className="mt-6" /> : null}
          </div>
          <Reveal delay={0.15} className="rounded-t-[10rem] rounded-b-3xl bg-kashi-900 px-8 pt-16 pb-10 text-center ring-1 ring-brick/40">
            <Icon className="mx-auto h-9 w-9 text-clay" />
            <p className="font-display mt-5 text-3xl">{d.ui.supportProgram}</p>
            <Link href={href(lang, "/donate")} className="mt-8 inline-block rounded-full bg-brick px-8 py-3.5 font-semibold text-ivory transition-colors hover:bg-brick-deep">
              {d.ui.donateNow}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- Neighbouring programmes ---------- */}
      <nav className="bg-plaster/60">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:grid-cols-2 sm:px-6">
          {[{ x: prev, dir: "prev" as const }, { x: next, dir: "next" as const }].map(({ x, dir }) => (
            <Link
              key={dir}
              href={href(lang, `/programs/${x.slug}`)}
              className={`group flex items-center gap-5 rounded-2xl bg-ivory p-4 ring-1 ring-mortar transition-colors hover:ring-brick/60 ${dir === "next" ? "flex-row-reverse text-end" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.program(x.slug)} alt="" loading="lazy" className="arch h-24 w-20 shrink-0 object-cover transition-transform duration-700 group-hover:-translate-y-1" />
              <div className="min-w-0 flex-1">
                {dir === "prev" ? <ArrowLeft className="flip-rtl h-5 w-5 text-brick" /> : <ArrowRight className="flip-rtl ms-auto h-5 w-5 text-brick" />}
                <p className="font-display mt-2 text-2xl text-kashi-950">{x.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
