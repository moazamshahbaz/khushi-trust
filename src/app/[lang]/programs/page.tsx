import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { DonateBand, PageHero, ProgramCard, SectionTitle } from "@/components/blocks";

export async function generateMetadata({ params }: PageProps<"/[lang]/programs">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).pages.programsIndex.title };
}

export default async function Programs({ params }: PageProps<"/[lang]/programs">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const p = d.pages.programsIndex;
  return (
    <>
      <PageHero eyebrow={d.site.name} title={p.title} subtitle={p.subtitle} image={IMG.program("women-empowerment")} />
      <section className="relative overflow-hidden bg-plaster py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          {p.sections[0]?.heading && <SectionTitle title={p.sections[0].heading} />}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {d.programs.map((x, i) => <ProgramCard key={x.slug} p={x} lang={lang} more={d.ui.learnMore} i={i} />)}
          </div>
        </div>
      </section>
      <DonateBand lang={lang} title={d.home.cta.title} body={d.home.cta.body} donate={d.ui.donateNow} volunteer={d.ui.volunteer} />
    </>
  );
}
