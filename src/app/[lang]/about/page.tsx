import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { hasLocale, href } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { DonateBand, PageHero, SectionText, SectionTitle, StarList, sectionParts, type Section } from "@/components/blocks";
import { ArchImage, Reveal } from "@/components/motion";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).pages.about.title };
}

export default async function About({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const p = d.pages.about;
  const sections = p.sections as Section[];
  const sec = (id: string) => sections.find((s) => s.id === id);
  const inspiration = sec("inspiration");
  const who = sec("who-we-are");
  const commitments = sec("commitments");
  const vision = sec("vision");
  const mission = sec("mission");
  const where = sec("where-we-serve");
  const legal = sec("legal-status");
  const legalItems = (legal?.items ?? []) as { title?: string; text?: string }[];

  return (
    <>
      <PageHero eyebrow={d.site.name} title={p.title} subtitle={p.subtitle} image={IMG.mosque} />

      {/* ---------- Our inspiration: the founder ---------- */}
      {inspiration && (
        <section className="relative overflow-hidden py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
            <Reveal className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-3 rounded-t-full border border-brick/40 sm:-inset-5" />
              <ArchImage src={IMG.founder} alt={d.site.founderDisplayName} className="aspect-[4/5] w-full" />
              <p className="mt-6 text-center font-display text-xl text-kashi-900">{d.site.founderDisplayName}</p>
            </Reveal>
            <div>
              <SectionTitle title={inspiration.heading ?? ""} center={false} />
              {sectionParts(inspiration).map((part) => {
                if (part === "bullets" && inspiration.bullets?.length)
                  return (
                    <Reveal key={part} className="mt-6 rounded-2xl bg-plaster/70 p-6 ring-1 ring-mortar">
                      <StarList items={inspiration.bullets} />
                    </Reveal>
                  );
                if (!part.startsWith("body.")) return null;
                const b = inspiration.body?.[Number(part.slice(5))];
                return b ? <Reveal key={part} delay={0.05}><p className="mt-6 text-lg text-ink/85">{b}</p></Reveal> : null;
              })}
              <Reveal delay={0.2} className="mt-10">
                <Link href={href(lang, "/qari-khushi")} className="inline-flex items-center gap-2 rounded-full bg-kashi-900 px-7 py-3 font-semibold text-ivory transition-colors hover:bg-kashi-700">
                  {d.nav.qariKhushi} <ArrowRight className="flip-rtl h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Who we are ---------- */}
      {who && (
        <section className="bg-plaster py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <SectionTitle title={who.heading ?? ""} />
            {who.body?.map((b, i) => (
              <Reveal key={i} delay={0.1}>
                <p className="font-display mt-8 text-2xl leading-snug text-kashi-900 sm:text-3xl">{b}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Commitments: twelve numbered tiles ---------- */}
      {commitments?.bullets?.length ? (
        <section className="py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle title={commitments.heading ?? ""} />
            <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-mortar ring-1 ring-mortar sm:grid-cols-2 lg:grid-cols-4">
              {commitments.bullets.map((b, i) => (
                <Reveal as="li" key={i} delay={(i % 4) * 0.06} className="flex flex-col bg-ivory p-7">
                  <span dir="ltr" className="font-display text-start text-4xl text-brick">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-4 text-lg text-kashi-950">{b}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ---------- Vision and mission ---------- */}
      {(vision || mission) && (
        <section className="relative isolate overflow-hidden bg-kashi-950 py-28 text-ivory">
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[5fr_6fr]">
            <Reveal><ArchImage src={IMG.school} alt="" className="mx-auto aspect-[4/5] w-full max-w-md" /></Reveal>
            <div className="space-y-14">
              {[vision, mission].filter((v): v is Section => !!v).map((v, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <h2 className="font-display mt-4 text-4xl text-clay sm:text-5xl">{v.heading}</h2>
                  {v.body?.map((b, j) => (
                    <p key={j} className="font-display mt-5 text-2xl leading-snug text-ivory/90 sm:text-3xl">{b}</p>
                  ))}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Where we serve ---------- */}
      {where && (
        <section className="pt-28 pb-36">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <SectionTitle title={where.heading ?? ""} center={false} />
              <SectionText s={where} lang={lang} />
            </div>
            <Reveal className="relative">
              <div className="overflow-hidden rounded-[2rem]">
                <ArchImage src={IMG.hero} alt="" className="aspect-[4/3] w-full [clip-path:none]" />
              </div>
              <div className="absolute -bottom-8 start-6 flex max-w-xs items-start gap-3 rounded-2xl bg-kashi-900 p-5 text-ivory shadow-2xl ring-1 ring-brick/40 sm:start-10">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-clay" />
                <p className="text-sm text-ivory/85">{d.site.contact.address}</p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Legal status ---------- */}
      {legal && (
        <section className="bg-plaster/70 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionTitle title={legal.heading ?? ""} subtitle={legal.body?.[0]} />
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {legalItems.map((it, i) => (
                <Reveal key={i} delay={i * 0.1} className="flex gap-5 rounded-2xl bg-ivory p-7 ring-1 ring-mortar">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-kashi-900 text-clay"><ShieldCheck className="h-6 w-6" /></span>
                  <div>
                    <h3 className="font-display text-2xl text-kashi-950">{it.title}</h3>
                    <p className="mt-1 text-muted">{it.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            {legal.body?.slice(1).map((b, i) => (
              <Reveal key={i} delay={0.2}><p className="mt-10 text-center text-lg font-semibold text-kashi-900">{b}</p></Reveal>
            ))}
          </div>
        </section>
      )}

      <DonateBand lang={lang} title={d.home.cta.title} body={d.home.cta.body} donate={d.ui.donateNow} volunteer={d.ui.volunteer} />
    </>
  );
}
