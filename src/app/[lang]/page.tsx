import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { hasLocale, href } from "@/lib/i18n";
import { getDict, homeStats, IMG } from "@/lib/content";
import { ArchImage, Counter, HeroImage, Reveal, Rosette } from "@/components/motion";
import { ArticleThumb, ProgramCard, SectionTitle } from "@/components/blocks";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const h = d.home;
  const stats = homeStats(d);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-24 text-ivory sm:items-center sm:pb-0">
        <HeroImage src={IMG.hero} alt="" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-kashi-950 via-kashi-950/75 to-kashi-950/35 sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l sm:from-kashi-950/95 sm:via-kashi-950/85 sm:to-kashi-950/20" />
        <Rosette className="pointer-events-none absolute -end-48 top-1/2 -z-10 hidden h-[44rem] w-[44rem] -translate-y-1/2 text-ivory/15 lg:block" />
        <div className="mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6">
          <div className="max-w-2xl">
            <Reveal>
              <p lang="ar" dir="rtl" className="text-start text-2xl text-clay sm:text-3xl" style={{ fontFamily: "var(--font-amiri)" }}>
                بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
            </Reveal>
            <Reveal delay={0.15}><p className="tracking-label mt-8 text-clay">{h.hero.eyebrow}</p></Reveal>
            <Reveal delay={0.25}>
              <h1 className="font-display mt-4 text-5xl leading-[1.05] sm:text-7xl">{h.hero.title}</h1>
            </Reveal>
            <Reveal delay={0.35}><p className="mt-6 max-w-xl text-lg text-ivory/85 sm:text-xl">{h.hero.subtitle}</p></Reveal>
            <Reveal delay={0.45} className="mt-10 flex flex-wrap gap-4">
              <Link href={href(lang, h.hero.primaryCta.href)} className="rounded-full bg-brick px-8 py-3.5 font-semibold text-ivory transition-colors hover:bg-brick-deep">
                {h.hero.primaryCta.label}
              </Link>
              <Link href={href(lang, h.hero.secondaryCta.href)} className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold ring-1 ring-ivory/50 transition-colors hover:bg-ivory/10">
                {h.hero.secondaryCta.label} <ArrowRight className="flip-rtl h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Impact counters ---------- */}
      <section className="relative border-b border-mortar bg-ivory">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-4 py-16 sm:px-6 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className="relative px-3 text-center">
              {i > 0 && <span className="absolute start-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-mortar lg:block" />}
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} className="font-display block text-4xl text-kashi-800 sm:text-5xl" />
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Who we are + founder ---------- */}
      <section className="relative overflow-hidden py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-t-full sm:-inset-5 border border-brick/40" />
            <ArchImage src={IMG.founder} alt={d.site.founderDisplayName} className="aspect-[4/5] w-full" />
            <p className="mt-6 text-center font-display text-xl text-kashi-900">{d.site.founderDisplayName}</p>
          </Reveal>
          <div>
            <SectionTitle eyebrow={d.site.name} title={h.intro.title} center={false} />
            {h.intro.body.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}><p className="mt-6 text-lg text-ink/85">{p}</p></Reveal>
            ))}
            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-4">
              <Link href={href(lang, "/about")} className="rounded-full bg-kashi-900 px-7 py-3 font-semibold text-ivory transition-colors hover:bg-kashi-700">{h.intro.link.label}</Link>
              <Link href={href(lang, "/qari-khushi")} className="inline-flex items-center gap-2 px-2 py-3 font-semibold text-kashi-800">
                {d.nav.qariKhushi} <ArrowRight className="flip-rtl h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Twelve pillars ---------- */}
      <section className="relative overflow-hidden bg-plaster py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={h.pillars.title} subtitle={h.pillars.subtitle} />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {d.programs.map((p, i) => <ProgramCard key={p.slug} p={p} lang={lang} more={d.ui.learnMore} i={i} />)}
          </div>
        </div>
      </section>

      {/* ---------- Vision & mission ---------- */}
      <section className="relative isolate overflow-hidden bg-kashi-950 py-28 text-ivory">
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[5fr_6fr]">
          <Reveal><ArchImage src={IMG.school} alt="" className="mx-auto aspect-[4/5] w-full max-w-md" /></Reveal>
          <div className="space-y-14">
            {[h.vision, h.mission].map((v, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <h2 className="font-display mt-4 text-4xl text-clay sm:text-5xl">{v.title}</h2>
                <p className="font-display mt-5 text-2xl leading-snug text-ivory/90 sm:text-3xl">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Support CTA ---------- */}
      <section className="py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow={h.cta.eyebrow} title={h.cta.title} subtitle={h.cta.body} center={false} />
            <Reveal delay={0.15} className="mt-8 space-y-3">
              {h.cta.badges.map((b) => (
                <p key={b} className="flex items-center gap-3 text-kashi-900"><CheckCircle2 className="h-5 w-5 text-brick" />{b}</p>
              ))}
            </Reveal>
            <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-4">
              {h.cta.links.map((l, i) => (
                <Link key={l.href} href={href(lang, l.href)} className={i === 0 ? "rounded-full bg-brick px-8 py-3.5 font-semibold text-ivory transition-colors hover:bg-brick-deep" : "rounded-full px-8 py-3.5 font-semibold text-kashi-900 ring-1 ring-kashi-900/40 transition-colors hover:bg-kashi-900 hover:text-ivory"}>
                  {l.label}
                </Link>
              ))}
            </Reveal>
          </div>
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[2rem]">
              <ArchImage src={IMG.community} alt="" className="aspect-[4/3] w-full [clip-path:none]" />
            </div>
            <div className="absolute -bottom-8 start-6 max-w-xs rounded-2xl bg-kashi-900 p-6 text-ivory shadow-2xl ring-1 ring-brick/40 sm:start-10">
              <p className="font-display text-2xl text-clay">{h.secondaryCta.title}</p>
              <p className="mt-2 text-sm text-ivory/80">{h.secondaryCta.body}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Articles ---------- */}
      <section className="bg-plaster/60 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={h.articles.title} subtitle={h.articles.subtitle} />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {d.articles.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.1} className="h-full">
                <Link href={href(lang, `/articles/${a.slug}`)} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-ivory ring-1 ring-mortar transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(17,26,41,.35)] hover:ring-brick/50">
                  <ArticleThumb src={IMG.article(a)} className="aspect-[4/3]" />
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-[1.65rem] leading-snug text-kashi-950">{a.title}</h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-muted">{a.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 border-t border-mortar pt-5 text-sm font-semibold text-brick">{d.ui.readMore} <ArrowRight className="flip-rtl h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
