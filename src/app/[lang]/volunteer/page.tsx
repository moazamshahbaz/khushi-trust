import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { PageHero, SectionTitle } from "@/components/blocks";
import { WhatsAppForm } from "@/components/forms";
import { Reveal } from "@/components/motion";

export async function generateMetadata({ params }: PageProps<"/[lang]/volunteer">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).pages.volunteer.title };
}

export default async function Volunteer({ params }: PageProps<"/[lang]/volunteer">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const p = d.pages.volunteer;
  const why = p.sections.find((s) => s.id === "why-volunteer") as { heading: string; items?: { title: string; text: string }[] } | undefined;
  const app = p.sections.find((s) => s.id === "application");
  return (
    <>
      <PageHero eyebrow={d.site.name} title={p.title} subtitle={p.subtitle || undefined} image={IMG.program("tree-plantation")} />
      {why && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <SectionTitle title={why.heading} />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {why.items?.map((it, i) => (
              <Reveal key={i} delay={i * 0.1} className="rounded-t-[999px] rounded-b-2xl bg-plaster/70 px-8 pt-16 pb-10 text-center ring-1 ring-mortar">
                <h3 className="font-display mt-5 text-2xl text-kashi-950">{it.title}</h3>
                <p className="mt-3 text-muted">{it.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}
      <section className="bg-plaster/60 py-24">
        <Reveal className="mx-auto max-w-3xl rounded-3xl bg-ivory p-6 ring-1 ring-mortar sm:p-10">
          <h2 className="font-display text-3xl text-kashi-950">{app?.heading}</h2>
          <div className="mt-8">
            <WhatsAppForm fields={p.form.fields} submitLabel={p.form.submitLabel} whatsapp={d.site.contact.whatsapp} heading={`${d.site.name}: ${d.ui.volunteer}`} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
