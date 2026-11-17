import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { PageHero, SectionTitle } from "@/components/blocks";
import { Reveal } from "@/components/motion";

export async function generateMetadata({ params }: PageProps<"/[lang]/team">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).team.title };
}

export default async function Team({ params }: PageProps<"/[lang]/team">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const t = d.team;
  return (
    <>
      <PageHero eyebrow={d.site.name} title={t.title} subtitle={t.subtitle || undefined} image={IMG.community} />
      <section className="mx-auto max-w-3xl px-4 pt-20 text-center sm:px-6">
        <Reveal><p className="text-lg text-ink/85">{t.intro}</p></Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle title={t.leadershipTitle} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.leadership.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col items-center rounded-t-[999px] rounded-b-2xl bg-plaster/70 px-6 pt-14 pb-8 text-center ring-1 ring-mortar">
                <span className="font-display grid h-20 w-20 place-items-center rounded-full bg-kashi-900 text-3xl text-clay ring-4 ring-ivory">
                  {m.name.trim().charAt(0)}
                </span>
                <h3 className="font-display mt-6 text-2xl text-kashi-950">{m.name}</h3>
                <p className="mt-2 text-sm font-semibold text-brick">{m.role}</p>
                {m.note && <p className="mt-1 text-sm text-muted">{m.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-kashi-950 py-24 text-ivory">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={t.committeesTitle} light />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {t.committees.map((c, i) => (
              <Reveal key={c.name} delay={(i % 3) * 0.08} className="h-full">
                <div className="h-full rounded-2xl bg-kashi-900/70 p-7 ring-1 ring-brick/25 backdrop-blur">
                  <h3 className="font-display mt-4 text-2xl text-clay">{c.name}</h3>
                  <p className="mt-4 text-sm text-ivory/60">{d.ui.chairman}</p>
                  <p className="font-semibold">{c.chair}</p>
                  {!!c.members.length && (
                    <>
                      <p className="mt-4 text-sm text-ivory/60">{d.ui.members}</p>
                      <ul className="mt-1 space-y-0.5">{c.members.map((m) => <li key={m}>{m}</li>)}</ul>
                    </>
                  )}
                  <p className="mt-5 border-t border-brick/20 pt-4 text-sm text-ivory/75">{c.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {t.closing && <Reveal className="mx-auto mt-16 max-w-3xl text-center text-lg text-ivory/80"><p>{t.closing}</p></Reveal>}
        </div>
      </section>
    </>
  );
}
