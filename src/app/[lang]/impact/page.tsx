import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { DonateBand, PageHero, ProgramLine, SectionTitle, ltr, type Section } from "@/components/blocks";
import { ArchImage, Counter, Reveal } from "@/components/motion";

export async function generateMetadata({ params }: PageProps<"/[lang]/impact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).pages.impact.title };
}

type Item = { title?: string; text?: string; programSlug?: string };

export default async function Impact({ params }: PageProps<"/[lang]/impact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const p = d.pages.impact;
  const sections = p.sections as Section[];
  const sec = (id: string) => sections.find((s) => s.id === id);
  const ration = sec("ration-distribution");
  const funds = sec("fund-utilization");
  const targets = sec("targets");

  // Ration bags per year as bars: the count is the first number in the second column
  const rows = (ration?.table?.rows ?? []).map((r) => ({
    year: String(r[0]),
    label: String(r[1]),
    n: Number(String(r[1]).match(/[\d,]+/)?.[0].replace(/,/g, "") ?? 0),
  }));
  const max = Math.max(1, ...rows.map((r) => r.n));

  return (
    <>
      <PageHero eyebrow={d.site.name} title={p.title} subtitle={p.subtitle} image={IMG.school} />

      {/* ---------- Headline figures ---------- */}
      <section className="border-b border-mortar bg-ivory">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 text-center sm:grid-cols-3 sm:px-6">
          {p.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1} className="relative">
              {i > 0 && <span className="absolute start-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-mortar sm:block" />}
              <Counter
                value={s.value}
                prefix={(s as { prefix?: string }).prefix}
                suffix={s.suffix}
                decimals={String(s.value).includes(".") ? 1 : 0}
                className="font-display text-5xl text-kashi-800 sm:text-6xl"
              />
              <p className="mt-2 text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Ration bags by year ---------- */}
      {ration && rows.length > 0 && (
        <section className="py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[5fr_7fr]">
            <Reveal className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-3 rounded-t-full border border-brick/40 sm:-inset-5" />
              <ArchImage src={IMG.program("food-assistance")} alt="" className="aspect-[4/5] w-full" />
            </Reveal>
            <div>
              <SectionTitle title={ration.heading ?? ""} subtitle={ration.table?.columns?.[1]} center={false} />
              <div className="mt-12 space-y-7">
                {rows.map((r, i) => (
                  <Reveal key={r.year} delay={i * 0.12}>
                    <div className="flex items-baseline justify-between gap-4">
                      <bdi dir="ltr" className="font-display text-2xl text-kashi-950">{r.year}</bdi>
                      <bdi className="font-semibold text-brick">{r.label}</bdi>
                    </div>
                    <div className="mt-3 h-4 overflow-hidden rounded-full bg-plaster ring-1 ring-mortar">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-kashi-800 to-kashi-500 rtl:bg-gradient-to-l"
                        style={{ width: `${(r.n / max) * 100}%` }}
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Where the money went ---------- */}
      {funds?.items?.length ? (
        <section className="bg-plaster py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle title={funds.heading ?? ""} />
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(funds.items as Item[]).map((it, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06} className="h-full">
                  {it.programSlug
                    ? <ProgramLine lang={lang} slug={it.programSlug} title={it.title} text={it.text} />
                    : <div className="h-full rounded-2xl bg-ivory p-5 ring-1 ring-mortar"><h3 className="font-display text-xl text-kashi-950">{it.title}</h3><p className="mt-1 text-sm text-muted">{it.text}</p></div>}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------- Targets for the coming year ---------- */}
      {targets?.items?.length ? (
        <section className="relative isolate overflow-hidden bg-kashi-950 py-28 text-ivory">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle title={targets.heading ?? ""} light />
            <ol className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {(targets.items as Item[]).map((it, i) => (
                <Reveal as="li" key={i} delay={(i % 3) * 0.06} className="flex gap-5 border-t border-brick/30 pt-6">
                  <span dir="ltr" className="font-display text-3xl text-clay">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl text-ivory">{it.title}</h3>
                    <p className="mt-2 text-ivory/75">{ltr(it.text)}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <DonateBand lang={lang} title={d.home.cta.title} body={d.home.cta.body} donate={d.ui.donateNow} volunteer={d.ui.volunteer} />
    </>
  );
}
